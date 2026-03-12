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
  startTime: z.iso.time(),
  endTime: z.iso.time(),
}).refine(
  (data) => {
    return data.startTime < data.endTime;
  },
  {
    error: "Invalid time interval",
    path: ["endTime"],
  },
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

export const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))$/, "Invalid time format"),
  additionalInfo: z.string().optional(),
})