"use client"

import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUser, LayoutDashboard } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const {isLoaded, user} = useUser()

  if (!isLoaded) {
    // fixes Clerk button hydration bug
    return <Skeleton className="h-10 w-10 rounded-full" />
  } else {
    // render Clerk button normally
    const profile = user?.username
    return <UserButton appearance={{
      elements: {
        avatarBox: "w-10 h-10"
      }
    }}>
      <UserButton.MenuItems>
        <UserButton.Link 
          label="My dashboard" 
          labelIcon={<LayoutDashboard size={15} />}
          href="/dashboard" 
        />
        <UserButton.Link 
          label="My profile"
          labelIcon={<CircleUser size={15} />}
          href={`/${profile}`}
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  }
}