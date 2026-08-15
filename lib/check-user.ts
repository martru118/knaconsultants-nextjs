import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { cache } from "react";

async function checkUser() {
  const user = await currentUser()
  if (!user) return null

  try {
    // user is logged in
    const loggedInUser = await getOwnership(user.id)
    
    if (loggedInUser) {
      // sync changes between Clerk and db
      if (loggedInUser.name !== user.fullName || loggedInUser.imageUrl !== user.imageUrl) {
        const syncedUser = await db.user.update({
          where: {
            clerkUserId: user.id,
          },
          data: {
            name: user.fullName,
            imageUrl: user.imageUrl
          }
        })

        return syncedUser
      }

      // current user session
      return loggedInUser
    }

    // generate dummy username based on slug
    const name = `${user.firstName} ${user.lastName}`;
    const slug = name.toLowerCase().split(" ").join("-") + user.id.slice(-4);
    (await clerkClient()).users.updateUser(user.id, {
      username: slug
    })

    // add new user to database
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: slug,
      }
    })

    return newUser
  } catch (error) {
    console.error(error)
  }
}

export const cachedUser = cache(checkUser)

export const getOwnership = cache(async (userId: string) => {
  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found")
  
  return user
})