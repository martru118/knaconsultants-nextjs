"use server";

import {
  dateFormat,
  DAYS_OF_WEEK_IN_ORDER,
  defaultAvailability,
} from "@/constants/constants";
import { db } from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-action";
import { availabilitySchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import {
  addDays,
  addMinutes,
  format,
  isAfter,
  parseISO,
  startOfDay,
} from "date-fns";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function getUserAvailability() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

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
  const availabilityData: Partial<typeof defaultAvailability> = {
    timeGap: user.availability.timeGap,
  };

  // assign availability by day of week
  DAYS_OF_WEEK_IN_ORDER.forEach((day) => {
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
        ? daysAvailable.endTime.toISOString().slice(11, 16)
        : "17:00",
    };
  });

  return availabilityData;
}

export const updateAvailability = createSafeAction(
  availabilitySchema,
  async(validatedData, context) => {
    // get availability of current user
    const user = await db.user.findUnique({
      where: { clerkUserId: context },
      include: {
        availability: true,
      },
    });
    if (!user) throw new Error("User not found");

    // transform the availability data into the format expected by the form
    const availabilityData = Object.entries(validatedData).flatMap(
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
          timeGap: validatedData.timeGap,
          days: {
            deleteMany: {},
            create: availabilityData,
          },
        },
      });
    } else {
      // write new availability data
      await db.availability.create({
        data: {
          userId: user.id,
          timeGap: validatedData.timeGap,
          days: {
            create: availabilityData,
          },
        },
      });
    }

    revalidatePath("/[username]/[eventId]", "page")
  }
)

async function getEventAvailability(eventId: string) {
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
            },
          },

          // get already booked timeslots
          bookings: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  // empty case
  if (!event || !event.user.availability) return {};

  // create date limits for bookings
  const { availability, bookings } = event.user;
  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, 30);

  const availableDates: Record<string, string[]> = {}
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    // find availability by weekday
    const dayOfWeek = format(date, "EEEE").toUpperCase();
    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek);

    // find available timeslots
    if (dayAvailability) {
      const dateStr = format(date, dateFormat);
      
      const slots = generateAvailableTimeslots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        bookings,
        dateStr,
        availability.timeGap
      );

      availableDates[dateStr] = slots
    }
  }

  return availableDates;
}

export const cachedEventAvailability = cache(getEventAvailability)

function generateAvailableTimeslots(
  startTime: Date,
  endTime: Date,
  duration: number,
  bookings: {
    startTime: Date;
    endTime: Date;
  }[],
  dateStr: string,
  timeGap: number = 0
) {
  const slots = [];
  let firstTime = parseISO(`${dateStr}T${startTime.toISOString().slice(11, 16)}`);
  const secondTime = parseISO(`${dateStr}T${endTime.toISOString().slice(11, 16)}`);
  const timeWithGap = addMinutes(firstTime, timeGap)

  while (firstTime < secondTime) {
    const slotEnd = new Date(firstTime.getTime() + duration * 60000);

    // check if current slot is available
    const isSlotAvailable = !bookings.some((booking) => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;

      // Availability must not fall under the following criteria
      // 1. Current time falls in between the start and end times of an existing booking
      // 2. End of a timeslot falls in between an existing booking time
      // 3. Invalid time chosen
      return (
        (firstTime >= bookingStart && firstTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (firstTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    // push all available timeslots
    if (isSlotAvailable && isAfter(timeWithGap, new Date())) slots.push(format(firstTime, "p"));
    firstTime = slotEnd;
  }

  return slots;
}
