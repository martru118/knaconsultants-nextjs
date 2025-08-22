"use server";

import db from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { success } from "zod";

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
