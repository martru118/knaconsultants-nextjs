"use client"

import { dayPickerSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz"
import z from "zod";
import { createBooking } from "@/actions/bookings";
import useFetch from "@/hooks/use-fetch";
import { useDayPicker } from "@/hooks/use-daypicker";
import { dateFormat, tzString } from "@/constants/constants";
import { BookingDayPicker } from "./booking-picker";
import { BookingInput } from "./booking-input";

interface BookingFormProps {
  availability: Record<string, string[]>
}

function BookingForm({ availability }: BookingFormProps) {
  const selectedDate = useDayPicker(state => state.selectedDate)
  const selectedTime = useDayPicker(state => state.selectedTime)

  const {
    setValue,
  } = useForm<z.infer<typeof dayPickerSchema>>({
    resolver: zodResolver(dayPickerSchema),
  });

  //initialize booking payload
  const { data } = useFetch(createBooking)

  // fetch all available dates
  const dateKey = format(selectedDate, dateFormat)
  const availableDays = useMemo(() =>
    Object.keys(availability).map(day => fromZonedTime(day, tzString)),
  [])

  // fetch all available timeslots on a specific day
  const timeSlots = useMemo(() => 
    dateKey in availability? availability[dateKey] : [],
  [dateKey])

  // manually validate selected date and time 
  useEffect(() => {
    if (selectedDate) setValue("date", dateKey)
  }, [selectedDate, setValue])
  useEffect(() => {
    if (selectedTime) setValue("time", selectedTime)
  }, [selectedTime, setValue])

  // success state
  if (data?.success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">✅ Booking successful!</h2>
        {data.booking && (
          <p>
            Join the meeting:{" "}
            <a
              href={data.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {data.booking}
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