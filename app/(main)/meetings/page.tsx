import { cachedUserMeetings } from "@/actions/meetings";
import MeetingsList from "./_components/meeting-list";
import { Suspense } from "react";
import { AppLoader } from "@/components/dashboard/AppLoader";

async function MeetingPage() {
  const meetings = await cachedUserMeetings()

  return (
    <Suspense fallback={<AppLoader />}>
      <MeetingsList meetings={meetings} />
    </Suspense>
  );
}

export default MeetingPage