"use server"

import db from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // send validated data to db
  const validatedData = eventSchema.parse(data)

  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found")

  const event = await db.event.create({
    data: {
      ...validatedData,
      userId: user.id,
    }
  })

  return event
}