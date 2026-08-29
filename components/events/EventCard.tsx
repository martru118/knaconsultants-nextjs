"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Link, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteEvent, UserEvent } from "@/actions/events";
import { useCopy } from "@/hooks/use-copy";
import { useDrawer } from "@/hooks/use-drawer";
import { motion } from "motion/react";

interface CardProps {
  event: UserEvent,
  user: string,
  isPublic?: boolean,
}

function EventCard({event, user, isPublic=false}: CardProps) {
  if (isPublic) {
    // public event cards to be shown in user page
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
      >
        <Card className="flex flex-col h-full justify-between cursor-pointer">
          <CardHeader>
            <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
            <CardDescription className="flex justify-between">
              <span>
                {event.duration} mins
              </span>
              <span>{event._count.bookings} Bookings</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-5">{event.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  } else {
    // show all event cards in dashboard 
    const isCopied = useCopy(state => state.isCopied)
    const setIsCopied = useCopy(state => state.setCopied)
    const resetCopied = useCopy(state => state.resetCopied)
    const setEvent = useDrawer(state => state.setEvent)
    const openDrawer = useDrawer(state => state.openDrawer)

    const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent)

    return (
      <Card className="flex flex-col h-full justify-between">
        <CardHeader>
          <CardTitle className="text-2xl line-clamp-2">{event.title}</CardTitle>
          <CardDescription className="flex justify-between">
            <span>
              {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
            </span>
            <span>{event._count.bookings} Bookings</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-5">{event.description}</p>
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
            variant="outline"
            onClick={() => {
              setEvent({
                id: event.id,
                title: event.title,
                description: event.description!,
                duration: event.duration,
                isPrivate: event.isPrivate,
              })

              // open form for editing
              openDrawer()
            }}
            disabled={loading}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (window?.confirm("Are you sure you want to delete this event?")) {
                await fnDeleteEvent({ eventId: event.id })
              }
            }}
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