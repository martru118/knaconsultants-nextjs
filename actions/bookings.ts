"use server"

import { tzString } from "@/constants/constants";
import { getOauthClient } from "@/lib/check-oauth";
import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { fromZonedTime } from "date-fns-tz";
import { google } from "googleapis";
import z from "zod";

const MeetingSchema = z.object({
  eventId: z.uuid(),
  name: z.string(),
  email: z.email(),
  startTime: z.date("Invalid date format"),
  endTime: z.date("Invalid date format"),
  additionalInfo: z.string().optional(),
})

export async function createBooking(bookingData: z.infer<typeof MeetingSchema>) {
  try {
    const event = await db.event.findUnique({
      where: {
        id: bookingData.eventId
      },
      include: {
        user: true
      }
    })
    if (!event) throw new Error("Event not found")

    // get oauth client
    const oauthClient = await getOauthClient(event.user.clerkUserId)
    const bookingStart = fromZonedTime(bookingData.startTime, tzString)
    const bookingEnd = fromZonedTime(bookingData.endTime, tzString)

    // generate Google Meet link
    const meetResponse = await google.calendar({
      version: "v3",
      auth: oauthClient,
    }).events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary: `${bookingData.name} - ${event?.title}`,
        description: bookingData.additionalInfo,
        start: {dateTime: bookingStart.toISOString()},
        end: {dateTime: bookingEnd.toISOString()},
        attendees: [
          {email: bookingData.email},
          {email: event.user.email},
        ],
        conferenceData: {
          createRequest: {
            requestId: `${event.id}-${Date.now()}`
          }
        },
      },
    })

    const meetingLink = meetResponse.data.hangoutLink
    const googleId = meetResponse.data.id

    // add booking to db
    await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingStart,
        endTime: bookingEnd,
        additionalInfo: bookingData.additionalInfo,
        meetLink: meetingLink!,
        googleEventId: googleId!,
      }
    })

    return {
      success: true,
      booking: meetingLink
    }
  } catch (error: any) {
    throw new Error(`Error creating booking: ${error.message}`)
  }
}