"use client"

import { useAuth, UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";
import { syncUserChanges } from "@/actions/users";

export default function UserMenu() {
  const {isLoaded} = useAuth()

  // sync changes between Clerk and db
  useEffect(() => {
    (async () => await syncUserChanges())();
  }, [isLoaded]);

  if (!isLoaded) {
    return <Skeleton className="h-10 w-10 rounded-full" />
  } else {
    return <UserButton appearance={{
      elements: {
        avatarBox: "w-10 h-10"
      }
    }}>
      <UserButton.MenuItems>
        <UserButton.Link 
          label="My Dashboard" 
          labelIcon={<LayoutDashboard size={15} />}
          href="/dashboard" 
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  }
}