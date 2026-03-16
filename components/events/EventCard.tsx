"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Link, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { deleteEvent } from "@/actions/events";
import { Event } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

interface CardProps {
  event: Event,
  user: string,
  isPublic?: boolean,
}

function EventCard({event, user, isPublic=false}: CardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  const handleCopy = async() => {
    try {
      // copy event link to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/${user}/${event.id}`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy event: ", error)
    }
  }

  // delete event by id
  const {loading, fn:fnDeleteEvent} = useFetch(deleteEvent)
  const handleDelete = async() => {
    if (window?.confirm("Are you sure you want to delete this event?")) {
      await fnDeleteEvent(event.id)
      revalidatePath("/events")
    }
  }

  return (
    <Card
      className="flex flex-col justify-between cursor-pointer"
    >
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

      {!isPublic && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={loading}
          >
            <Link className="mr-2 h-4 w-4" />
            {isCopied? "Copied!" : "Copy Link"}
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
      )}
    </Card>
  );
}

export default EventCard;