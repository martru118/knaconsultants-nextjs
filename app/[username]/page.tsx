import { cachedUserEvents } from "@/actions/users";
import CreateEventButton from "@/components/events/CreateEventButton";
import EventCard from "@/components/events/EventCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Home, User } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { profile } from "@/public/locales/en/common.json";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PageProps {
  params: Promise<{username: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {username} = await params
  const user = await cachedUserEvents(username)

  if (!user) return {
    title: "User not found"
  }

  // get metadata for the user
  return {
    title: `${user.name}'s Profile | K&A Consultants`,
    description: `Book an event with ${user.name}. View available public events and schedules.`,
  }
}

async function UserPage({params}: PageProps) {
  // retrieve username from url
  const {username} = await params
  const user = await cachedUserEvents(username)
  if (!user) return notFound()

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(125% 80% at 50% 0%, var(--primary) 0%, transparent 80%)',
          opacity: 0.6
        }}
      />
      <main className="relative min-h-screen overflow-hidden px-4 py-4">
        <div className="mx-auto pb-8 md:px-4 flex justify-between items-center">
          <Button asChild variant="ghost">
            <Link href="/">
              <Home data-icon="inline-start" />{" "}
              {profile.nav}
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <SignedOut>
              <ThemeToggle />
              <Logo />
            </SignedOut>
            <SignedIn>
              <CreateEventButton />
              <UserMenu />
            </SignedIn>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage className="rounded-full" src={user.imageUrl!} alt={user.name!} />
            <AvatarFallback className="inline-flex items-center justify-center w-24 h-24 text-7xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-400 rounded-full">
              <User className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-muted-foreground text-center">
            {profile.heading}
          </p>
        </div>

        {user.events.length === 0? (
          <p className="text-gray-600 text-center">{profile.empty}</p>
        ) : (
          <div className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {user.events.map((event) => {
              return <Link key={`${event.id}`} href={`/${username}/${event.id}`}>
                <EventCard 
                  key={event.id}
                  event={event as any}
                  user={username}
                  isPublic
                />
              </Link>
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default UserPage