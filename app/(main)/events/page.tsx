import { getCachedUserEvents } from "@/actions/events";
import EventCard from "@/components/events/EventCard";
import { Suspense } from "react";

function EventsPage() {
  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <Events />
    </Suspense>
  );
}

async function Events() {
  const {event, username} = await getCachedUserEvents()

  if (event.length === 0) {
    return <p>You haven&apos;t created any events yet.</p>
  } else {
    return <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {event.map((event) => (
        // show list of events
        <EventCard key={event.id} event={event} user={username} />
      ))}
    </div>
  }
}

export default EventsPage;