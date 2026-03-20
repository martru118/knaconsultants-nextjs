import { auth } from "@clerk/nextjs/server"
import z from "zod"

// server action state
export type ActionState<T> = {data?: T} | Error

// try/catch wrapper for server actions
export function createSafeAction<TInput, TOutput>(
  schema: z.ZodType<TInput>,
  action: (data: TInput, user: string) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    // unauthorized user access
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized")

    // invalid form input
    const parse = schema.safeParse(input);
    if (!parse.success) throw new Error(`Invalid format: ${parse.error}`)

    try {
      // return data on success
      const data = await action(parse.data, session.userId);
      return { data };
    } catch (error) {
      // other errors
      throw new Error("Something went wrong. Please try again.")
    }
  }
}