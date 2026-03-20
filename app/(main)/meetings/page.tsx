import { cachedUserMeetings, getUserMeetings } from "@/actions/meetings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeetingsList from "./_components/meeting-list";
import { Suspense } from "react";

function MeetingPage() {
  return (
    <div className="-mt-5">
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Suspense fallback={<div>Loading upcoming meetings...</div>}>
            <UpcomingMeetings />
          </Suspense>
        </TabsContent>
        <TabsContent value="past">
          <Suspense fallback={<div>Loading upcoming meetings...</div>}>
            <PastMeetings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function UpcomingMeetings() {
  const meetings = await cachedUserMeetings("upcoming")
  return <MeetingsList meetings={meetings} filter="upcoming" />
}

async function PastMeetings() {
  const meetings = await getUserMeetings("past")
  return <MeetingsList meetings={meetings} filter="past" />
}

export default MeetingPage