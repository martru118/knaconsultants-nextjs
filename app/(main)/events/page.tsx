import { cachedDashboardEvents } from "@/actions/events";
import { AppLoader } from "@/components/dashboard/AppLoader";
import EventCard from "@/components/events/EventCard";
import { Suspense } from "react";

function EventsDashboard() {
  return (
    <Suspense fallback={<AppLoader />}>
      <EventsPage />
    </Suspense>
  );
}

async function EventsPage() {
  const {event, username} = await cachedDashboardEvents()

  if (!event.length) {
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

export default EventsDashboard;