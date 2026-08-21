import { cachedEventDetails } from "@/actions/event-details";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailsCard from "./_components/event-details";
import { Suspense } from "react";
import BookingForm from "./_components/booking-form";
import { cachedEventAvailability } from "@/actions/availability";
import { BeatLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/Footer";
import { booking } from "@/public/locales/en/common.json"

interface PageProps {
  params: Promise<{username: string, eventId: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
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

async function EventBookingPage({params}: PageProps) {
  // get event details from db
  const {username, eventId} = await params
  const eventDetails = await cachedEventDetails(username, eventId)
  if (!eventDetails) return notFound()

  // get available timeslots for this event
  const availabilities = await cachedEventAvailability(eventId)

  return <>
    <main className="relative h-full flex flex-col justify-center lg:flex-row">
      <Suspense fallback={<EventDetailsLoader />}>
        <EventDetailsCard event={eventDetails} />
      </Suspense>

      <div className="flex flex-col p-8 border bg-background lg:w-2/3">   
        <Suspense fallback={<BookingLoader />}>
          <BookingForm availability={availabilities} />
        </Suspense>
      </div>
    </main>
    <Footer />
  </>
}

function EventDetailsLoader() {
  return <div className="p-10 border lg:w-1/3 bg-secondary">
    <Skeleton className="h-8 w-full mb-4 mt-2" />

    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>

    <div className="flex flex-col gap-2 mt-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="aspect-video" />
    </div>
  </div>
}

function BookingLoader() {
  return <div className="flex flex-col w-full m-auto gap-2 items-center">
    <BeatLoader size={20} />
    <p>{booking.loading}</p>
  </div>
}

export default EventBookingPage;