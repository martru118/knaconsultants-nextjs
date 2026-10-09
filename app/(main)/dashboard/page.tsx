"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { domain } from "@/constants/constants";
import { useProfileStore } from "@/hooks/use-profile";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { AppLoader } from "@/components/dashboard/AppLoader";

interface DashboardProps {
  user: User
}

function Dashboard() {
  const { isLoaded, user } = useUser();

  if (isLoaded) {
    return (
      <div className="space-y-5">
        <LatestMeetingsCard user={user as any} />
        <UniqueLinkCard user={user as any} />
      </div>
    );
  } else {
    // display loading state
    return <AppLoader />
  }
}

function LatestMeetingsCard({user}: DashboardProps) {
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
      <CardContent>
        {!loading ? (
          <div className="font-light">
            <div>
              {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                <ul className="list-disc ml-4">
                  {upcomingMeetings?.map((meeting) => (
                    <li key={meeting.id}>
                      <a 
                        href={meeting.meetLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {meeting.event.title} with {meeting.name} 
                      </a>{" "}
                      on {format(
                        new Date(meeting.startTime),
                        "MMM d, yyyy h:mm a"
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming meetings</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading updates...</p>
        )}
      </CardContent>
    </Card>
  )
}

function UniqueLinkCard({user}: DashboardProps) {
  const isUpdated = useProfileStore(state => state.isUpdated)
  const setIsUpdated = useProfileStore(state => state.setIsUpdated)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: user?.username || ""
    }
  });

  const {
    loading,
    error: e,
    fn: fnUpdateUsername,
  } = useFetch(updateUsername);

  async function onSubmitForm(data: z.infer<typeof usernameSchema>) {
    const response = await fnUpdateUsername({ username: data.username });

    // handle success and error states
    if (response) {
      setIsUpdated(true)
      window.alert("Username changed successfully")
    } else {
      setError("username", { message: "Username already taken" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your unique link</CardTitle>
        <p className="text-sm font-light text-muted-foreground">
          Last updated: {isUpdated? "Just now" : format(new Date(user.updatedAt), "MMMM d, yyyy h:mm a")}
        </p>
      </CardHeader>

      <CardContent>
        <form id="username-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <Field>
            <div className="flex flex-col md:flex-row gap-1">
              <FieldLabel>{domain}/</FieldLabel>
              <InputGroup>
                <InputGroupInput {...register("username")} placeholder="username" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton 
                    variant="secondary" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading? <Spinner data-icon="inline-start" /> : null}
                    Update
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            {
              // error for form input
              errors.username && <FieldError className="text-destructive text-sm -mt-2">
                {errors.username.message}
              </FieldError>
            }
            {
              // api error
              e && <FieldError className="text-destructive text-sm -mt-2">
                {e.message}
              </FieldError>
            }
          </Field>
        </form>
      </CardContent>
    </Card>
  )
}

export default Dashboard;