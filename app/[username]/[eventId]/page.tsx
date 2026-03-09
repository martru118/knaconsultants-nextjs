import { getEventDetails } from "@/actions/event-details";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailsCard from "./_components/EventDetails";

interface EventPageProps {
  params: Promise<{username: string, eventId: string}>
}

export async function generateMetadata({params}: EventPageProps): Promise<Metadata> {
  const {username, eventId} = await params
  const event = await getEventDetails(username, eventId)

  if (!event) return {
    title: "Event not found"
  }

  // get metadata for the event booking
  return {
    title: `Book ${event.title} with ${event.user.name} | K&A Consultants`,
    description: `Schedule a ${event.duration}-minute ${event.title} meeting with ${event.user.name}.`,
  }
}

async function EventBookingPage({params}: EventPageProps) {
  const {username, eventId} = await params
  const eventDetails = await getEventDetails(username, eventId)
  if (!eventDetails) notFound()

  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
      <EventDetailsCard event={eventDetails} />
    </div>
  );
}

export default EventBookingPage;