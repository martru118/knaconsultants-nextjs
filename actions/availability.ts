"use server";

import { DAYS_OF_WEEK, defaultAvailability } from "@/app/(main)/availability/data";
import { Booking } from "@/lib/generated/prisma";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, format, isBefore, parseISO, startOfDay } from "date-fns";

const dateFormat = "yyyy-MM-dd"

export async function getUserAvailability() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // get availability of current user
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: {
        include: { days: true },
      },
    },
  });
  if (!user || !user.availability) return null;

  // create availability data
  const availabilityData: any = {
    timeGap: user.availability.timeGap,
  };

  // assign availability by day of week
  DAYS_OF_WEEK.forEach((day) => {
    const daysAvailable = user.availability?.days.find(
      (d) => d.day === day.toUpperCase()
    );

    // transform the availability data into the format expected by the form
    availabilityData[day] = {
      isAvailable: !!daysAvailable,
      startTime: daysAvailable
        ? daysAvailable.startTime.toISOString().slice(11, 16)
        : "09:00",
      endTime: daysAvailable
        ? daysAvailable.startTime.toISOString().slice(11, 16)
        : "17:00",
    };
  });

  return availabilityData;
}

export async function updateAvailability(data: typeof defaultAvailability) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // get availability of current user
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: true,
    },
  });
  if (!user) throw new Error("User not found");

  // transform the availability data into the format expected by the form
  const availabilityData = Object.entries(data).flatMap(
    ([day, { isAvailable, startTime, endTime }]: any) => {
      if (isAvailable) {
        const baseDate = new Date().toISOString().split("T")[0];
        return [
          {
            day: day.toUpperCase(),
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
          },
        ];
      }

      return []
    }
  );

  if (user.availability) {
    // overwrite existing availability data
    await db.availability.update({
      where: {
        id: user.availability.id,
      },
      data: {
        timeGap: data.timeGap,
        days: {
          deleteMany: {},
          create: availabilityData
        }
      }
    })
  } else {
    // write new availability data
    await db.availability.create({
      data: {
        userId: user.id,
        timeGap: data.timeGap,
        days: {
          create: availabilityData
        }
      }
    })
  }

  return { success: true }
}

export async function getEventAvailability(eventId: string) {
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      user: {
        include: {
          // get user availability
          availability: {
            select: {
              days: true,
              timeGap: true,
            }
          },

          // get already booked timeslots
          bookings: {
            select: {
              startTime: true,
              endTime: true,
            }
          }
        }
      }
    }
  })

  // empty case
  if (!event || !event.user.availability) return []

  // create date limits for bookings
  const {availability, bookings} = event.user
  const startDate = startOfDay(new Date())
  const endDate = addDays(startDate, 30)

  // get available timeslots
  const availableDates = []
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = format(date, "EEEE").toUpperCase()
    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek)

    // find available timeslots
    if (dayAvailability) {
      const dateStr = format(date, dateFormat)
      const slots = generateAvailableTimeslots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        bookings,
        dateStr,
        availability.timeGap
      )

      availableDates.push({
        date: dateStr,
        slots,
      })
    }
  }

  return availableDates
}

function generateAvailableTimeslots(
  startTime: Date,
  endTime: Date,
  duration: number,
  bookings: {
    startTime: Date,
    endTime: Date,
  }[],
  dateStr: string,
  timeGap: number = 0
) {
  const slots = []
  let currentTime = parseISO(`${dateStr}T${startTime.toISOString().slice(11, 16)}`)
  const limitTime = parseISO(`${dateStr}T${endTime.toISOString().slice(11, 16)}`)

  // exclude past timeslots
  const now = new Date()
  if (format(now, dateFormat) === dateStr) {
    currentTime = isBefore(currentTime, now)? addMinutes(now, timeGap) : currentTime
  }

  while (currentTime < limitTime) {
    const slotEnd = new Date(currentTime.getTime() + duration*60000)

    // check if current slot is available
    const isSlotAvailable = !bookings.some(booking => {
      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime

      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||  // current time falls in between booking start and end times
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||          // slot end time falls in between booking times
        (currentTime <= bookingStart && slotEnd >= bookingEnd)        // invalid time
      )
    })

    // push all available timeslots
    if (isSlotAvailable) slots.push(format(currentTime, "HH:mm"))
    currentTime = slotEnd
  }

  return slots
}