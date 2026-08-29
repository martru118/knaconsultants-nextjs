"use server"

import { getOauthClient } from "@/lib/check-oauth";
import { getOwnership } from "@/lib/check-user";
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

export async function getUserMeetings() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getOwnership(userId)

  // get meetings filtered by time
  const now = new Date();
  const meetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: { 
        gte: now 
      },
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
      startTime: "asc"
    },
    take: 10
  });

  return meetings
}

export const cachedUserMeetings = cache(getUserMeetings)

async function getLatestMeetings() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getOwnership(userId)

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
    const user = await getOwnership(context)

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