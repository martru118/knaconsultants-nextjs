import { AppHeader } from "@/components/dashboard/AppHeader";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { checkUser } from "@/lib/check-user";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

async function AppLayout({ children }: LayoutProps) {
  await checkUser()

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        {/* ---------------- Main ---------------- */}
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default AppLayout;
