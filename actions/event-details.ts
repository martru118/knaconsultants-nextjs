"use server"

import { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { cache } from "react";

export type EventDetails = Prisma.EventGetPayload<{
  include: {
    user: {
      select: {
        name: true,
        email: true,
        imageUrl: true,
      }
    }
  }
}>

async function getEventDetails(username: string, eventId: string) {
  // find event by username and event id
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      }
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        }
      }
    }
  })

  return event
}

export const cachedEventDetails = cache(getEventDetails)