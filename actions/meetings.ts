"use server"

import { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export type UserMeetings = Prisma.BookingGetPayload<{
  include: {
    event: {
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    },
  },
}>

export async function getUserMeetings(filter: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // get meetings filtered by time
  const now = new Date();
  const meetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: filter === "upcoming" ? { gte: now } : { lt: now },
    },
    include: {
      event: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: filter === "upcoming"? "asc" : "desc"
    }
  });

  return meetings
}

async function getLatestMeetings() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // get meetings filtered by time
  const now = new Date();
  const upcomingMeetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: {gte: now},
    },
    include: {
      event: {
        select: {title: true},
      },
    },
    orderBy: {
      startTime: "asc"
    },
    take: 3
  });

  return upcomingMeetings
}

export const cachedLatestMeetings = cache(getLatestMeetings)