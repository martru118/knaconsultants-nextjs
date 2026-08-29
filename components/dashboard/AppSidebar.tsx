"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { NavItem, NavMain } from "@/components/dashboard/NavMain";
import { Calendar, Clock, LayoutDashboard, Users } from "lucide-react";
import CreateEventButton from "../events/CreateEventButton";

export const navData: NavItem[] = [
  // Dashboards Section
  { label: "Overview", isSection: true },
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Events", icon: Calendar, href: "/events" },
  { title: "Meetings", icon: Users, href: "/meetings" },
  { title: "Availability", icon: Clock, href: "/availability" },
];

export function AppSidebar() {
  return (
    <Sidebar className="px-0 h-full [&_[data-slot=sidebar-inner]]:h-full">
      {/* ---------------- Header ---------------- */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="/" className="w-full h-full">
              <Logo uniColor />
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ---------------- Content ---------------- */}
      <div className="flex flex-col gap-6">
        <SidebarContent className="overflow-hidden">
					<SidebarGroup>
						<SidebarMenuItem>
							<CreateEventButton isSidebar />
						</SidebarMenuItem>
					</SidebarGroup>
					<div className="px-4">
						<NavMain items={navData} />
					</div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
