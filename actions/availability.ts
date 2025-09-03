"use server";

import { DAYS_OF_WEEK } from "@/app/(main)/availability/data";
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
