import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { cache } from "react";

export async function checkUser() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  try {
    // user already exists
    const loggedInUser = await getOwnership(user.id)
    if (loggedInUser) return loggedInUser

    // generate dummy username based on slug
    const name = `${user.firstName} ${user.lastName}`;
    const slug = name.toLowerCase().split(" ").join("-") + user.id.slice(-4);
    (await clerkClient()).users.updateUser(user.id, {
      username: slug
    })

    // add new user to database
    await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: slug,
      }
    })
  } catch (error: any) {
    throw new Error(`Problem creating user: ${error.message}`)
  }
}

export const getOwnership = cache(async (userId: string) => {
  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found")
  
  return user
})