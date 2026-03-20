"use client"

import { cancelMeeting } from "@/actions/meetings";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";

interface CancelMeetingProps {
  meetingId: string,
}

export default function CancelMeetingButton({meetingId}: CancelMeetingProps) {
  const router = useRouter()
  const { loading, error, fn: fnCancelMeeting } = useFetch(cancelMeeting)

  async function handleCancel() {
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      await fnCancelMeeting({ meetingId: meetingId });
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button variant="destructive" onClick={handleCancel} disabled={loading}>
        {loading ? "Canceling..." : "Cancel Meeting"}
      </Button>
      {error && <span className="text-destructive text-sm">{error.message}</span>}
    </div>
  )
}