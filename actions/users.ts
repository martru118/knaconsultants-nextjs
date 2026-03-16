"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // check if username is already taken
  const existingUsername = await db.user.findUnique({
    where: { username },
  });

  if (existingUsername && existingUsername.id !== userId) {
    throw new Error("Username is already taken");
  }

  // update username in database
  await db.user.update({
    where: { clerkUserId: userId },
    data: { username },
  });

  //update username in Clerk
  (await clerkClient()).users.updateUser(userId, {
    username
  })

  return {
    success: true
  }
}

export async function getUserFromClerk(userId: string) {
  // get user image
  const client = await clerkClient()
  const {fullName, imageUrl} = await client.users.getUser(userId)
  return {fullName, imageUrl}
}

export async function getUserByUsername(username: string) {
  const user = await db.user.findUnique({
    where: {username},
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      events: {
        where: {
          isPrivate: false
        },
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          isPrivate: true,
          _count: {
            select: {bookings: true}
          }
        }
      }
    }
  })

  return user
}