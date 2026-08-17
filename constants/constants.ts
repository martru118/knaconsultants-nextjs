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

// booking form selector schema
export const spokenLanguages = [
  { label: "English", value: "en" },
  { label: "Cantonese (粵語)", value: "zh-yue" },
  { label: "Mandarin (普通話)", value: "zh" },
  { label: "Vietnamese (Tiếng Việt)", value: "vi" },
] as const

// constant strings
export const dateFormat = "yyyy-MM-dd" as const
export const tzString = "America/Toronto" as const
export const domain = "localhost:3000" as const
export const emailAddress = "martru118@gmail.com" as const