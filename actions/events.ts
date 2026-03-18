"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-action";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export type UserEvent = Prisma.EventGetPayload<{
  include: {
    _count: {
      select: { bookings: true },
    },
  },
}>

export const createEvent = createSafeAction(
  eventSchema,
  async(validatedData, clerkId) => {
    // get current user from db
    const user = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });
    if (!user) throw new Error("User not found");

    // create user event
    await db.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        isPrivate: validatedData.isPrivate,
        userId: user.id,
      },
    });
  
    return true;
  }
)

export const updateEvent = createSafeAction(
  eventSchema,
  async(validatedData, clerkId) => {
    // get current user from db
    const user = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });
    if (!user) throw new Error("User not found");

    // overwrite existing user event
    await db.event.update({
      where: {
        id: validatedData.id,
        userId: user.id,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        isPrivate: validatedData.isPrivate,
      },
    })

    return true
  }
)

async function getDashboardEvents() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // find events made by current user
  const event = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return {
    event,
    username: user.username,
  };
}

export const cachedDashboardEvents = cache(getDashboardEvents);

export async function deleteEvent(eventId: string) {
  try {
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
  
    // delete event from authenticated user
    await db.event.delete({
      where: {
        id: eventId,
        userId: user.id,
      },
    })
  
    return true
  } catch (error: any) {
    throw new Error(`Failed to delete event: ${error.message || error}`)
  }
}