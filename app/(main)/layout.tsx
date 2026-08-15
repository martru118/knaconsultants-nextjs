"use client";

import { useUser } from "@clerk/nextjs";
import { Calendar, Clock, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BarLoader } from "react-spinners";

// sidebar menu items
const navOptions = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/meetings", label: "Meetings", icon: Users },
  { href: "/availability", label: "Availability", icon: Clock },
];

interface LayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: LayoutProps) {
  const { isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <>
      {!isLoaded && <BarLoader className="min-w-screen" color="#36d7b7" />}
      <div className="flex flex-col min-h-screen bg-muted md:flex-row">
        <aside className="hidden md:block w-64 bg-background">
          <nav className="mt-8">
            <ul>
              {navOptions.map((option) => (
                <li key={option.href}>
                  <Link
                    href={option.href}
                    className={`flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 ${
                      pathname === option.href ? "bg-blue-100" : ""
                    }`}
                  >
                    <option.icon className="w-5 h-5 mr-3" />
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto px-2 py-4 md:p-8">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-5xl md:text-6xl gradient-title pt-2 md:pt-0 text-center md:text-left">
              {navOptions.find((option) => option.href === pathname)?.label}
            </h2>
          </header>
          {children}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background shadow-md">
        <ul className="flex justify-around">
          {navOptions.map((option) => (
            <li key={option.href}>
              <Link
                href={option.href}
                className={`flex flex-col items-center py-2 px-4 ${
                  pathname === option.href ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <option.icon className="w-5 h-5" />
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
function AppSkeleton() {
  
}

export default AppLayout;
