"use server";

import { DAYS_OF_WEEK, defaultAvailability } from "@/app/(main)/availability/data";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
