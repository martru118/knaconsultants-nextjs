import { clerkClient } from "@clerk/nextjs/server"
import { google } from "googleapis"

export async function getOauthClient(clerkUserId: string) {
  try {
    // get oauth token
    const client = await clerkClient()
    const { data } = await client.users.getUserOauthAccessToken(
      clerkUserId,
      "google",
    )

    const token = data[0].token
    if (!token || data.length === 0) throw new Error("No Oauth data or token found for the user.")

    // setup Google oauth client
    const oauthClient = new google.auth.OAuth2()
    oauthClient.setCredentials({access_token: token})
    return oauthClient
  } catch (error: any) {
    throw new Error(`Failed to get OAuth client: ${error.message}`)
  }
}