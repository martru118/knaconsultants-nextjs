"use server"

import { Prisma } from "@/lib/generated/prisma";
import db from "@/lib/prisma";

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

export async function getEventDetails(username: string, eventId: string): Promise<EventDetails> {
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

  return event!
}