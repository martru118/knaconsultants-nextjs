import { getUserMeetings } from "@/actions/meetings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeetingList from "./_components/meeting-list";
import { Suspense } from "react";

function MeetingPage() {
  return (
    <div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Suspense fallback={<div>Loading upcoming meetings...</div>}>
            
          </Suspense>
        </TabsContent>
        <TabsContent value="past">
          <Suspense fallback={<div>Loading upcoming meetings...</div>}>
              
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function upcomingMeetings() {
  const meetings = await getUserMeetings("upcoming")
  return 
}

export default MeetingPage