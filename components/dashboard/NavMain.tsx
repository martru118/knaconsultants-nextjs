"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
};

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <>
      {items.map((item, index) => (
        <NavMainItem
          key={item.title || item.label || index}
          item={item}
        />
      ))}
    </>
  );
}

function NavMainItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isParentActive = pathname === item.href

  // Section label
  if (item.isSection && item.label) {
    return (
      <SidebarGroup className="p-0 pt-5 first:pt-0">
        <SidebarGroupLabel className="p-0 text-xs font-medium uppercase text-sidebar-foreground">
          {item.label}
        </SidebarGroupLabel>
      </SidebarGroup>
    );
  }

  // Item without children
  if (item.title) {
    return (
      <SidebarGroup className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              id={`nav-main-button-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              tooltip={item.title}
              isActive={isParentActive}
              className={cn(
                "rounded-md text-sm font-medium px-3 py-2 h-9 transition-colors cursor-pointer",
                isParentActive ? "bg-secondary! text-primary!" : ""
              )}
              asChild
            >
              <a href={item.href}>
                {item.icon && <item.icon />}
                {item.title}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return null;
}
