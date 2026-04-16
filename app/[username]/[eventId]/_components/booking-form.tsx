"use client"

import { EventDetails } from "@/actions/event-details";
import { bookingSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { addDays, format, parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { createBooking } from "@/actions/bookings";
import useFetch from "@/hooks/use-fetch";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useDayPicker } from "@/hooks/use-daypicker";
import { dateFormat, tzString } from "@/constants/constants";
import { Separator } from "@/components/ui/separator";

const today = new Date()

interface BookingFormProps {
  currentEvent: EventDetails,
  availability: Record<string, string[]>
}

function BookingForm({currentEvent, availability}: BookingFormProps) {
  const {
    selectedDate, 
    selectedTime, 
    setDate, 
    setTime
  } = useDayPicker()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  const {
    data, 
    loading, 
    error: e,
    fn: fnCreateBooking
  } = useFetch(createBooking)

  // fetch available time slots for particular day
  const dateKey = format(selectedDate, dateFormat)
  const availableDays = useMemo(() =>
    Object.keys(availability).map(day => fromZonedTime(day, tzString)),
  [])
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

  async function onSubmit(data: z.infer<typeof bookingSchema>) {
    if (!selectedDate || !selectedTime) {
      console.error("Date or time not selected")
      return
    }

    // format am/pm time to utc
    const ampm = parse(selectedTime, "hh:mm a", new Date())
    const formattedTime = format(ampm, "HH:mm")

    // format start and end times
    const startTime = new Date(`${dateKey}T${formattedTime}`)
    const endTime = new Date(startTime.getTime() + currentEvent.duration*60000)

    // prepare booking data object
    const bookingData = {
      eventId: currentEvent.id,
      name: data.name,
      email: data.email,
      startTime,
      endTime,
      additionalInfo: data.additionalInfo,
    }

    //console.log(startTime.toISOString())
    await fnCreateBooking(bookingData)

    // handle error state
    if (e) {
      setError("root", {
        message: e.message
      })
    }
  }

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

  return (
    <>
      <div className="md:h-85 flex flex-col md:flex-row gap-5">
        <div className="max-w-full">
          <DayPicker 
            mode="single" 
            required
            animate
            selected={selectedDate} 
            onSelect={date => {
              setDate(date)
              setTime(undefined)
            }}
            disabled={{
              before: today,
              after: addDays(today, 30),
            }}
            classNames={{
              selected: `font-bold outline-3 outline-blue-700 w-10 h-10 rounded-full`,
            }}
            modifiers={{
              available: availableDays,
            }}
            modifiersClassNames={{
              available: `bg-blue-200 w-10 h-10 rounded-full`,
            }}
          />
        </div>
        <Separator className="lg:visible" orientation="vertical" />
        <div className="max-w-full h-full mt-2 md:overflow-scroll no-scrollbar">
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2">
              Available time slots
            </h3>
            {!timeSlots.length && (
              <p className="text-md">No time slots available.</p>
            )}
            {selectedDate && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {timeSlots.map(slot => {
                  return (                  
                    <Button 
                      key={slot} 
                      onClick={() => {
                        setTime(slot)

                        // scroll to form section on click
                        setTimeout(() => {                          
                          const element = document.getElementById("booking-submit")
                          element?.scrollIntoView({ behavior: "smooth" })
                        }, 10);
                      }}
                      variant={selectedTime === slot? "default" : "outline"}
                    >
                      {slot}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTime && // display booking form when time is selected
        <form className="max-w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <p>Your selection: {dateKey} at {selectedTime}</p>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="attendee-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="attendee-name"
                {...register("name")} 
                placeholder="Your name" 
                required
                className="-mt-2"
              />
            </Field>
            <Field className="-mt-4">
              <FieldLabel htmlFor="attendee-email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="attendee-email"
                {...register("email")} 
                type="email" 
                placeholder="Your email"
                required
                className="-mt-2"
              />
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="booking-info">Additional info</FieldLabel>
            <Textarea id="booking-info"
              {...register("additionalInfo")} 
              placeholder="What would you like to discuss?" 
              className="-mt-2 overflow-y-auto"
            />
          </Field>

          <div id="booking-submit" className="flex flex-col">
            <Button 
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading? <Spinner data-icon="inline-start" /> : null}
              Schedule event
            </Button>
            {errors.date && (
              <p className="text-destructive text-sm mt-2">{errors.date.message}</p>
            )}
            {errors.time && (
              <p className="text-destructive text-sm mt-2">{errors.time.message}</p>
            )}
            {errors && (
              <p className="text-destructive text-sm mt-2">{errors.root?.message}</p>
            )}
          </div>
        </form>
      }
    </>
  );
}

export default BookingForm