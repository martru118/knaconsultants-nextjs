import { getUserByUsername } from "@/actions/users";
import EventCard from "@/components/events/EventCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: Promise<{username: string}>
}

export async function generateMetadata({params}: UserPageProps): Promise<Metadata> {
  const {username} = await params
  const user = await getUserByUsername(username)

  if (!user) return {
    title: "User not found"
  }

  // get metadata for the user
  return {
    title: `${user.name}'s Profile | K&A Consultants`,
    description: `Book an event with ${user.name}. View available public events and schedules.`,
  }
}

async function UserPage({params}: UserPageProps) {
  // retrieve username from url
  const {username} = await params
  const user = await getUserByUsername(username)
  if (!user) return notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage className="rounded-full" src={user.imageUrl!} alt={user.name!} />
          <AvatarFallback className="inline-flex items-center justify-center w-24 h-24 text-7xl text-white bg-blue-600 rounded-full">
            {user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600 text-center">
          Welcome to my scheduling page! Please select an event to book a call with me.
        </p>
      </div>

      {user.events.length === 0? (
        <p className="text-gray-600 text-center">No public events available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}

export default UserPage