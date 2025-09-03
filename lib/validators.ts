import z from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
});

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be 500 characters or less"),
  duration: z.number().int().positive("Duration must be a positive number"),
  isPrivate: z.boolean(),
});

export const daySchema = z.object({
  isAvailable: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
}).refine(
  (data) => {
    if (data.isAvailable) {
      // prevent end time underflow
      return data.startTime! < data.endTime!;
    }

    return true;
  },
  {
    error: "End time must be later than start time",
    path: ["endTime"],
  }
);

export const availabilitySchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, "Time gap must be greater than 0 minutes").int(),
});
