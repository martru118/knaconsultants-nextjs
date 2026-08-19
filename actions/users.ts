"use server";

import { getOwnership } from "@/lib/check-user";
import { db } from "@/lib/prisma";
import { usernameSchema } from "@/lib/validators";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import z from "zod";

export async function updateUsername(user: z.infer<typeof usernameSchema>) {
  const { userId } = await auth();
  const { success, data } = usernameSchema.safeParse(user);
  if (!userId || !success) throw new Error("Invalid format or user not authenticated");

  // check if username is already taken
  const name = data.username;
  const existingUsername = await db.user.findUnique({
    where: {
      username: name,
    },
  });

  if (existingUsername && existingUsername.id !== userId) {
    throw new Error("Username is already taken");
  }

  // update username in database
  await db.user.update({
    where: { clerkUserId: userId },
    data: { username: name },
  });

  //update username in Clerk
  (await clerkClient()).users.updateUser(userId, user);
}

async function getUserEvents(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      events: {
        where: {
          isPrivate: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          _count: {
            select: { bookings: true },
          },
        },
      },
    },
  });

  return user;
}

export const cachedUserEvents = cache(getUserEvents)

export async function getProfileUsername(email: string) {
  // fetch username by email
  const user = await db.user.findFirst({
    where: { email },
    select: {
      username: true,
    }
  })

  return user?.username ?? null
}

export async function syncUserChanges() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized");

  try {
    // user is logged in
    const loggedInUser = await getOwnership(user.id)

    if (loggedInUser) {
      // check for name or profile picutre mismatch
      if (loggedInUser.name !== user.fullName || loggedInUser.imageUrl !== user.imageUrl) {
        await db.user.update({
          where: {
            clerkUserId: user.id,
          },
          data: {
            name: user.fullName,
            imageUrl: user.imageUrl
          }
        })
      }
    }
  } catch (error: any) {
    throw new Error(`Problem syncing user: ${error.message}`)
  }
}