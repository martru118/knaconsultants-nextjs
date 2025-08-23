"use server"

import db from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // send validated data to db
  const validatedData = eventSchema.parse(data)

  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found")

  const event = await db.event.create({
    data: {
      ...validatedData,
      userId: user.id,
    }
  })

  return event
}

export async function getUserEvents() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found")

  // find events made by current user
  const event = await db.event.findMany({
    where: {userId: user.id},
    orderBy: {createdAt: "desc"},
    include: {
      _count: {
        select: {bookings: true}
      }
    }
  })

  return {
    event,
    username: user.username,
  }
}

export async function deleteEvent(eventId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found")

  // find events made by current user
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
  })
  if (!event || event.userId !== user.id) throw new Error("Event not found")

  // delete event by id
  await db.event.delete({
    where: {
      id: eventId,
    },
  })

  return {
    success: true
  }
}