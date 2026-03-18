import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export async function checkUser() {
  const user = await currentUser()
  if (!user) return null

  try {
    // user is logged in
    const loggedInUser = await db?.user.findUnique({
      where: {
        clerkUserId: user.id,
      }
    })
    if (loggedInUser) return loggedInUser

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