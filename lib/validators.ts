import z from "zod";

// username input schema in dashboard
export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Username can only contain letters, numbers, and hyphens"
    ),
});

// event form schema
export const eventSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  duration: z.number().int().positive("Duration must be a positive number"),
  isPrivate: z.boolean(),
});

export type EventSchemaType = z.infer<typeof eventSchema>

// availability schemas
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

// booking form schemas
const dayPickerSchema = z.object({
  date: z.iso.date("Invalid date format"),
  time: z.string().regex(/^\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))$/, "Invalid time format"),
})

const bookingInputSchema = z.object({
  name: z.string().min(2, "Name is required").max(50, "Invalid name format"),
  email: z.email("Invalid email"),
  additionalInfo: z.string().max(500, "Must be 500 characters or less").optional(),
})

export const bookingSchema = dayPickerSchema.extend(bookingInputSchema.shape)
export type BookingSchemaType = z.infer<typeof bookingSchema>

// Google Calendar events schema
export const meetingSchema = z.object({
  eventId: z.uuid(),
  name: z.string(),
  email: z.email(),
  startTime: z.date("Invalid date format"),
  endTime: z.date("Invalid date format"),
  additionalInfo: z.string().optional(),
})

export type MeetingSchemaType = z.infer<typeof meetingSchema>