"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/validators";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import z from "zod";
import { getLatestUpdates, UserMeetings } from "@/actions/meetings";
import { format } from "date-fns";

function Dashboard() {
  const { isLoaded, user } = useUser();

  // handle form state
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
  });

  // update username to db
  const {
    loading: loadingUser,
    error,
    fn: fnUpdateUsername,
  } = useFetch(updateUsername);
  useEffect(() => {
    setValue("username", user?.username || "");
  }, [isLoaded]);

  // get latest meetings from Google Calendar
  const {
    loading: loadingUpdates,
    data: upcomingMeetings,
    fn: fnUpdates,
  } = useFetch(getLatestUpdates);
  useEffect(() => {
    (async () => await fnUpdates())();
  }, []);

  async function onSubmitForm(data: { username: string }) {
    fnUpdateUsername(data.username);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.fullName}</CardTitle>
        </CardHeader>

        {!loadingUpdates ? (
          <div className="space-y-6 font-light">
            <div>
              {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {upcomingMeetings?.map((meeting: UserMeetings) => (
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
                <p className="pl-5">No upcoming meetings</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading updates...</p>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your unique link</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span>localhost:3000/</span>
                <Input {...register("username")} placeholder="username" />
              </div>

              {
                // error for form input
                errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )
              }
              {
                // api error
                errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.root?.message}
                  </p>
                )
              }
            </div>

            {loadingUser && (
              <BarLoader className="mb-4 w-full" color="#36d7b7" />
            )}
            <Button type="submit">Update username</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
