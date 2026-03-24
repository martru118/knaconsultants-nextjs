"use server"

import { getOauthClient } from "@/lib/check-oauth";
import { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-action";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import z from "zod";

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

export const cachedUserMeetings = cache(getUserMeetings)

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

export const cancelMeeting = createSafeAction(
  z.object({ meetingId: z.uuid() }),
  async (validatedData, context) => {
    // get current user from db
    const user = await db.user.findUnique({
      where: { clerkUserId: context },
    });
    if (!user) throw new Error("User not found")

    // get current meeting from db
    const bookingId = validatedData.meetingId
    const meeting = await db.booking.findUnique({
      where: {
        id: bookingId,
      }
    })
    if (!meeting || meeting.userId !== user.id) throw new Error("Meeting not found");

    // get oauth tokens
    const oauthClient = await getOauthClient(context)
    const calendar = google.calendar({ version: "v3", auth: oauthClient });

    try {
      await calendar.events.delete({
        calendarId: "primary",
        eventId: meeting.googleEventId,
      });
    } catch (error: any) {
      throw new Error("Failed to delete event from Google Calendar:", error);
    }

    // Delete the meeting from the database
    await db.booking.delete({
      where: { 
        id: bookingId,
        userId: user.id,
      },
    });

    revalidatePath("/meetings")
  }
)