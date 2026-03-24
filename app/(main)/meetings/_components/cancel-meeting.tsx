"use client"

import { cancelMeeting } from "@/actions/meetings";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";

interface CancelMeetingProps {
  meetingId: string,
}

export default function CancelMeetingButton({meetingId}: CancelMeetingProps) {
  const { loading, error, fn: fnCancelMeeting } = useFetch(cancelMeeting)

  async function handleCancel() {
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      await fnCancelMeeting({ meetingId: meetingId });
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button variant="destructive" onClick={handleCancel} disabled={loading}>
        {loading ? "Canceling..." : "Cancel Meeting"}
      </Button>
    </div>
  )
}