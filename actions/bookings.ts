"use server"

import { getOauthClient } from "@/lib/check-oauth";
import { db } from "@/lib/prisma";
import { meetingSchema, MeetingSchemaType } from "@/lib/validators";
import { google } from "googleapis";

export async function createBooking(bookingData: MeetingSchemaType) {
  // validate incoming data
  const {success, data: meetingData} = meetingSchema.safeParse(bookingData)
  if (!success) throw new Error("Invalid data")

  // get event info from db
  const event = await db.event.findUnique({
    where: {
      id: meetingData.eventId,
    },
    include: {
      user: true
    }
  })
  if (!event) throw new Error("Event not found")

  try {
    // get oauth client
    const oauthClient = await getOauthClient(event.user.clerkUserId)
    const bookingStart = meetingData.startTime
    const bookingEnd = meetingData.endTime

    // generate Google Meet link
    const meetResponse = await google.calendar({
      version: "v3",
      auth: oauthClient,
    }).events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary: `${meetingData.name} - ${event?.title}`,
        description: meetingData.additionalInfo,
        start: {dateTime: bookingStart.toISOString()},
        end: {dateTime: bookingEnd.toISOString()},
        attendees: [
          {email: meetingData.email},
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
        name: meetingData.name,
        email: meetingData.email,
        startTime: bookingStart,
        endTime: bookingEnd,
        additionalInfo: meetingData.additionalInfo,
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