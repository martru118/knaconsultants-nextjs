import { auth } from "@clerk/nextjs/server"
import z from "zod"

// error messages for server actions
export type ActionError = {
  serverError?: string,
  validationErrors?: Record<string, unknown>,
}

// server action state
export type ActionState<T> = {data?: T} & ActionError

// try/catch wrapper for server actions
export function createSafeAction<TInput, TOutput>(
  schema: z.ZodType<TInput>,
  action: (data: TInput, user: string) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    // invalid form input
    const parse = schema.safeParse(input);
    if (!parse.success) {
      return { validationErrors: z.treeifyError(parse.error) };
    }

    // unauthorized user access
    const session = await auth();
    if (!session.userId) {
      return { serverError: "Unauthorized" };
    }

    try {
      // return data on success
      const data = await action(parse.data, session.userId);
      return { data };
    } catch (error) {
      // other errors
      console.error("Action Error:", error);
      return { serverError: "Something went wrong. Please try again." };
    }
  }
}