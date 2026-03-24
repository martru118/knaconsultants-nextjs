"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/validators";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import z from "zod";
import { cachedLatestMeetings } from "@/actions/meetings";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface LatestUpdatesProps {
  user: User
}

interface UniqueLinkProps {
  response: boolean,
  user: User
}

function Dashboard() {
  const { isLoaded, user } = useUser();

  return (
    <div className="space-y-8">
      <LatestMeetingsCard user={user as any} />
      <UniqueLinkCard response={isLoaded} user={user as any} />
    </div>
  );
}

function LatestMeetingsCard({user}: LatestUpdatesProps) {
  const {
    loading,
    data: upcomingMeetings,
    fn: fnUpdates,
  } = useFetch(cachedLatestMeetings);

  // get latest updates from Google Calendar
  useEffect(() => {
    (async () => await fnUpdates())();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {user?.firstName}</CardTitle>
      </CardHeader>

      {!loading ? (
        <div className="space-y-6 font-light pl-5">
          <div>
            {upcomingMeetings && upcomingMeetings?.length > 0 ? (
              <ul className="list-disc pl-5">
                {upcomingMeetings?.map((meeting) => (
                  <li key={meeting.id}>
                    {meeting.event.title} on{" "}
                    {format(
                      new Date(meeting.startTime),
                      "MMM d, yyyy h:mm a"
                    )}{" "}
                    with {meeting.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming meetings</p>
            )}
          </div>
        </div>
      ) : (
        <p className="pl-5">Loading updates...</p>
      )}
    </Card>
  )
}

function UniqueLinkCard({response, user}: UniqueLinkProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
  });

  const {
    loading,
    error: e,
    fn: fnUpdateUsername,
  } = useFetch(updateUsername);
  
  useEffect(() => {
    // get username from clerk
    setValue("username", user?.username || "");
  }, [response]);

  async function onSubmitForm(data: z.infer<typeof usernameSchema>) {
    await fnUpdateUsername({ username: data.username });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your unique link</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="username-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span>localhost:3000/</span>
              <Input {...register("username")} placeholder="username" />
            </div>
            {
              // error for form input
              errors.username && (
                <p className="text-destructive text-sm mt-1">
                  {errors.username.message}
                </p>
              )
            }
            {
              // api error
              e && (
                <p className="text-destructive text-sm mt-1">
                  {e.message}
                </p>
              )
            }
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button type="submit" disabled={loading} form="username-form">
          {loading? <Spinner data-icon="inline-start" /> : null}
          Update username
        </Button>

        <Link 
          href={`${window.location.origin}/${user?.username}`} 
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="button" variant="outline" disabled={loading}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default Dashboard;
