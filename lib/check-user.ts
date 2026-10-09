import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { generateSlug } from "./helper";

export async function checkUser() {
  const user = await currentUser()
  if (!user) return null

  try {
    const loggedInUser = await getOwnership(user.id)
    
    // check for name and profile picture mismatch
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
  } catch (error) {
    // create new user on error
    const name = `${user.firstName} ${user.lastName}`;
    const slug = generateSlug(name, user.id);
    
    // generate dummy username for new user
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
  }
}

export async function getOwnership(userId: string) {
  // get current user from db
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found")
  
  return user
}