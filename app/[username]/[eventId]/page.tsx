import { cachedEventDetails } from "@/actions/event-details";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailsCard from "./_components/event-details";
import { Suspense } from "react";
import BookingForm from "./_components/booking-form";
import { cachedEventAvailability } from "@/actions/availability";

interface EventPageProps {
  params: Promise<{username: string, eventId: string}>
}

export async function generateMetadata({params}: EventPageProps): Promise<Metadata> {
  const {username, eventId} = await params
  const event = await cachedEventDetails(username, eventId)

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
  const eventDetails = await cachedEventDetails(username, eventId)
  if (!eventDetails) return notFound()

  // get available timeslots for this event
  const availabilities = await cachedEventAvailability(eventId)

  return (
    <div className="max-w-[90-vw] flex flex-col justify-center lg:flex-row px-4 py-8">
      <EventDetailsCard event={eventDetails} />

      <Suspense fallback={<div>Loading booking form...</div>}>
        <BookingForm currentEvent={eventDetails} availability={availabilities}/>
      </Suspense>
    </div>
  );
}

export default EventBookingPage;