// availability object schema
export const defaultAvailability = {
  monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  timeGap: 0,
};

export const DAYS_OF_WEEK_IN_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const