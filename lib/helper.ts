import { format, parse } from "date-fns";

export function converttoUTC(time: string, date: string) {
  const ampm = parse(time, "hh:mm a", new Date())
  const formattedTime = format(ampm, "HH:mm")
  return new Date(`${date}T${formattedTime}`)
}