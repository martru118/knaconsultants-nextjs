"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CreateEventButton from "@/components/events/CreateEventButton";
import UserMenu from "./UserMenu";
import { nav } from "@/public/locales/en/common.json"
import { useProfileStore } from "@/hooks/use-profile";
import { emailAddress } from "@/constants/constants";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const fetchProfile = useProfileStore(state => state.fetchProfile)

  // get username for action button
  useEffect(() => {
    (async () => await fetchProfile(emailAddress))();
  }, []);

  // handle scroll transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-20 w-full transition-all duration-300",
          isScrolled &&
            "bg-background/75 backdrop-blur-lg"
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-6 transition-all duration-200 lg:gap-0",
              isScrolled && "py-3"
            )}
          >
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              {/* Navbar logo */}
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              {/* Mobile navbar hamburger button */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              {/* Desktop navbar */}
              <div className="m-auto hidden size-fit lg:block">
                <ul className="flex gap-1">
                  {nav.map((item, index) => (
                    <li key={index}>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                      >
                        <Link href={item.href} className="text-base">
                          <span>{item.title}</span>
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile navbar */}
            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {nav.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-secondary-foreground block duration-150"
                      >
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navbar action buttons */}
              <ActionButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

function ActionButton() {
  const userProfile = useProfileStore(state => state.profile)
  const router = useRouter()

  return <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
    <SignedOut>
      <SignInButton forceRedirectUrl="/dashboard">
        <Button variant="outline">Login</Button>
      </SignInButton>
      {/*
      <Button className="cursor-pointer" onClick={() => router.push(`/${userProfile}`)}>
        <Phone data-icon="inline-start" className="mr-1" />
        Book a call
      </Button>
      */}
    </SignedOut>
    <SignedIn>
      <CreateEventButton />
      <UserMenu />
    </SignedIn>
  </div>
}