"use client"

import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

function UserMenu() {
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

export default UserMenu;