"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Link, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteEvent } from "@/actions/events";
import { Event } from "@/lib/generated/prisma/client";
import { useCopy } from "@/hooks/use-copy";
import { useRouter } from "next/navigation";

interface CardProps {
  event: Event,
  user: string,
  isPublic?: boolean,
}

function EventCard({event, user, isPublic=false}: CardProps) {
  const isCopied = useCopy(state => state.isCopied)
  const setIsCopied = useCopy(state => state.setCopied)
  const resetCopied = useCopy(state => state.resetCopied)
  const router = useRouter()

  // delete event by id
  const {loading, fn:fnDeleteEvent} = useFetch(deleteEvent)
  async function handleDelete() {
    if (window?.confirm("Are you sure you want to delete this event?")) {
      await fnDeleteEvent(event.id)
      router.refresh()
    }
  }

  if (isPublic) {
    // public event cards to be shown in user page
    return (
      <Card className="flex flex-col justify-between cursor-pointer">
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <CardDescription className="flex justify-between">
            <span>
              {event.duration} mins
            </span>
            <span>{event._count.bookings} Bookings</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{event.description}</p>
        </CardContent>
      </Card>
    )
  } else {
    // show all event cards in dashboard 
    return (
      <Card className="flex flex-col justify-between cursor-pointer">
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <CardDescription className="flex justify-between">
            <span>
              {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
            </span>
            <span>{event._count.bookings} Bookings</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{event.description}</p>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              setIsCopied(event.id)
              await navigator.clipboard.writeText(`${window.location.origin}/${user}/${event.id}`)
              setTimeout(() => resetCopied(), 2000)
            }}
            disabled={loading}
          >
            <Link className="mr-2 h-4 w-4" />
            {isCopied === event.id? "Copied!" : "Copy link"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    )
  }
}

export default EventCard;