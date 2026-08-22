import { UserMeetings } from "@/actions/meetings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, Video } from "lucide-react";
import CancelMeetingButton from "./cancel-meeting";

interface MeetingProps {
  meetings: UserMeetings[],
  filter: string,
}

export default function MeetingsList({meetings, filter}: MeetingProps) {
  if (meetings.length === 0) return <p>No {filter} meetings found.</p>
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {meetings.map((meeting) => (
        <Card key={meeting.id} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{meeting.event.title}</CardTitle>
            <CardDescription>with {meeting.name}</CardDescription>
            <CardDescription>
              &quot;{meeting.additionalInfo}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="flex items-center mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(new Date(meeting.startTime), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center mb-2">
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {format(new Date(meeting.startTime), "h:mm a")} -{" "}
                {format(new Date(meeting.endTime), "h:mm a")}
              </span>
            </div>
            {meeting.meetLink && (
              <div className="flex items-center">
                <Video className="mr-2 h-4 w-4" />
                <a
                  href={meeting.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Join Meeting
                </a>
              </div>
            )}
          </CardContent>
          {filter === "upcoming" && (
            <CardFooter className="flex justify-between">
              <CancelMeetingButton meetingId={meeting.id} />
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}