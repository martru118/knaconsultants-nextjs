"use client"

import { EventDetails } from "@/actions/event-details";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { tzString } from "@/constants/constants";
import { ArrowLeft, Clock, Globe } from "lucide-react";
import Link from "next/link";
import { booking } from "@/public/locales/en/common.json"
import { useDayPicker } from "@/hooks/use-daypicker";
import { useEffect } from "react";

interface EventDetailsProps{
  event: EventDetails,
  cancel: string  // cancel action returns to user page
}

export default function EventDetailsCard({event, cancel}: EventDetailsProps) {
  const setEventInfo = useDayPicker(state => state.setEventInfo)
  const {user} = event

  // initialize booking data
  useEffect(() => setEventInfo(event), [])

  return (
    <div className="p-10 border lg:w-1/3 bg-secondary">
      <Button asChild variant="ghost" className="hover:bg-primary-foreground">
        <Link href={`/${cancel}`}>
          <ArrowLeft />
          <span>{booking.nav}</span>
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-4 mt-2">{event.title}</h1>

      <div className="flex items-center mb-4">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage className="rounded-full" src={user.imageUrl!} alt={user.name!} />
          <AvatarFallback className="inline-flex items-center justify-center w-12 h-12 text-xl text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-full">
            {user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center mb-2">
        <Clock className="mr-2" />
        <span>{event.duration} minutes</span>
      </div>
      <div className="flex items-center mb-4">
        <Globe className="mr-2" />
        <span>{tzString}</span>
      </div>
      <p className="text-gray-700">{event.description}</p>
    </div>
  );
}