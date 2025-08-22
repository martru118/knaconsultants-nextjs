"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/validators";
import React, { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";

function Dashboard() {
  const { isLoaded, user } = useUser();

  // handle form state
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  // set username value
  useEffect(() => {
    setValue("username", user?.username || "");
  }, [isLoaded]);

  // update username to db
  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmitForm = async (data: any) => {
    fnUpdateUsername(data.username);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}</CardTitle>
        </CardHeader>

        {/* TODO: Latest updates */}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your unique link</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span>{window?.location.origin}/</span>
                <Input {...register("username")} placeholder="username" />
              </div>

              {// error for form input
                errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )
              }
              {// api error
                errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.root?.message}
                  </p>
                )
              }
            </div>

            {loading && <BarLoader className="mb-4 w-full" color="#36d7b7" />}
            <Button type="submit">Update username</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
