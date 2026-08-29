"use client";

import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import UserMenu from "@/components/UserMenu";
import { getPathTitle } from "@/lib/helper";
import { usePathname } from "next/navigation";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const title = getPathTitle(pathname.slice(1))

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        {/* ---------------- Main ---------------- */}
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b px-4">
            <SidebarTrigger className="cursor-pointer"/>
            <span>{title}</span>
            <UserMenu />
          </header>
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default AppLayout;
