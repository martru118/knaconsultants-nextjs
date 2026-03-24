"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-action";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import z from "zod";

export type UserEvent = Prisma.EventGetPayload<{
  include: {
    _count: {
      select: { bookings: true },
    },
  },
}>

export const createEvent = createSafeAction(
  eventSchema,
  async(validatedData, context) => {
    // get current user from db
    const user = await db.user.findUnique({
      where: { clerkUserId: context },
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
  
    // created successfully
    revalidatePath("/events")
    revalidatePath("/[username]", "page")
  }
)

export const updateEvent = createSafeAction(
  eventSchema,
  async(validatedData, context) => {
    // get current user from db
    const user = await db.user.findUnique({
      where: { clerkUserId: context },
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

    // updated successfully
    revalidatePath("/events")
    revalidatePath("/[username]", "page")
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

export const deleteEvent = createSafeAction(
  z.object({ eventId: z.uuid() }),
  async(validatedData, context) => {
    // get current user from db
    const user = await db.user.findUnique({
      where: { clerkUserId: context },
    });
    if (!user) throw new Error("User not found")
  
    // delete event from authenticated user
    const event = await db.event.delete({
      where: {
        id: validatedData.eventId,
        userId: user.id,
      },
    })
    if (!event || event.userId !== user.id) throw new Error("Event not found")
    
    // deleted successfully
    revalidatePath("/events")
    revalidatePath("/[username]", "page")
  }
)