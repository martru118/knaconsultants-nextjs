"use client"

import { getPathTitle } from "@/lib/helper";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import UserMenu from "../UserMenu";
import { ThemeToggle } from "../ThemeToggle";

export function AppHeader() {
  const pathname = usePathname();
  const title = getPathTitle(pathname.slice(1))

  return (
    <header className="sticky top-0 z-50 md:border-x flex h-14 items-center justify-between border-b px-4">
      <SidebarTrigger className="cursor-pointer"/>
      <span>{title}</span>
      <div className="flex flex-row space-x-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}