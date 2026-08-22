"use client"

import { useMemo } from "react";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz"
import { useDayPicker } from "@/hooks/use-daypicker";
import { dateFormat, tzString } from "@/constants/constants";
import { BookingDayPicker } from "./booking-picker";
import { BookingInput } from "./booking-input";
import { booking } from "@/public/locales/en/common.json"

interface BookingFormProps {
  availability: Record<string, string[]>
}

function BookingForm({ availability }: BookingFormProps) {
  //initialize booking payload
  const selectedDate = useDayPicker(state => state.selectedDate)
  const response = useDayPicker(state => state.response)
  const bookingData = useDayPicker(state => state.booking)

  // fetch all available dates
  const dateKey = format(selectedDate, dateFormat)
  const availableDays = useMemo(() =>
    Object.keys(availability).map(day => fromZonedTime(day, tzString)),
  [])

  // fetch all available timeslots on a specific day
  const timeSlots = useMemo(() => 
    dateKey in availability? availability[dateKey] : [],
  [dateKey])

  // success state
  if (response) {
    return (
      <div className="text-center my-auto">
        <h2 className="text-2xl font-bold mb-4">✅ Booking successful!</h2>
        {bookingData && (
          <p>
            {booking.success.message}<br/>
            Join the meeting:{" "}
            <a
              href={bookingData}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {bookingData}
            </a>
          </p>
        )}
      </div>
    );
  }

  return <>
    <BookingDayPicker availabilities={availableDays} slots={timeSlots} />
    <BookingInput dateKey={dateKey} />
  </>
}

export default BookingForm