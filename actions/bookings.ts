"use server"

import { Booking } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { calendar_v3, google } from "googleapis";
import { success } from "zod";

async function getOauthClient(clerkUserId: string) {
  try{

  } catch (error: any) {
    throw new Error(`Failed to get OAuth client: ${error.message }`)
  }
}

export async function createBooking(bookingData: Booking) {
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

    // get oauth token
    const client = await clerkClient()
    const { data } = await client.users.getUserOauthAccessToken(
      event.user.clerkUserId,
      "google",
    )

    const token = data[0].token
    if (!token || data.length === 0) throw new Error("No Oauth data or token found for the user.")

    // setup Google oauth client
    const oauthClient = new google.auth.OAuth2()
    oauthClient.setCredentials({access_token: token})
    //return oauthClient

    // generate Google Meet link
    const meetResponse = await google.calendar({
      version: "v3",
      auth: oauthClient,
    }).events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${bookingData.name} - ${event?.title}`,
        description: bookingData.additionalInfo,
        start: {dateTime: bookingData.startTime.toISOString()},
        end: {dateTime: bookingData.endTime.toISOString()},
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
    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        additionalInfo: bookingData.additionalInfo,
        meetLink: meetingLink!,
        googleEventId: googleId!,
      }
    })

    return {
      sucess: true,
      booking: meetingLink
    }
  } catch (error: any) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}