"use client"

import { EventDetails } from "@/actions/event-details";
import { bookingSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";

const dateFormat = "yyyy-MM-dd"

interface BookingFormProps {
  currentEvent: EventDetails,
  availability: {
    date: string;
    slots: string[];
  }[]
}

function BookingForm({currentEvent, availability}: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {errors},
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  // manually validate selected date and time 
  // can be replaced with controller component
  useEffect(() => {
    if (selectedDate) setValue("date", format(selectedDate, dateFormat))
  }, [selectedDate, setValue])
  useEffect(() => {
    if (selectedTime) setValue("time", selectedTime)
  }, [selectedTime, setValue])

  async function onSubmit(data: any) {
    console.log(data)
  }

  // fetch available days
  const availableDays = availability.map(day => {
    // remove time zone string
    const isoDate = new Date(day.date)
    const dateOnly = new Date(isoDate.valueOf() + isoDate.getTimezoneOffset()*60*1000)
    return dateOnly
  })

  // fetch available time slots for particular day
  const timeSlots = selectedDate
    ? availability.find(
      day => day.date === format(selectedDate, dateFormat)
    )?.slots || []
  : []

  return (
    <div className="flex flex-col p-8 border bg-background">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker 
            mode="single" 
            animate
            timeZone="America/Toronto"
            selected={selectedDate!} 
            onSelect={date => {
              setSelectedDate(date!)
              setSelectedTime("")
            }}
            disabled={[
              {before: new Date()}
            ]}
            modifiers={{
              available: availableDays,
            }}
            modifiersStyles={{
              available: {
                background: "lightblue",
                borderRadius: 100,
              }
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Available time slots
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {timeSlots.map(slot => {
                  return <Button 
                    key={slot} 
                    onClick={() => setSelectedTime(slot as string)}
                    variant={selectedTime === slot? "default" : "outline"}
                  >
                    {slot}
                  </Button>
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTime && 
        <form className="space-y-4 lg:-mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input {...register("name")} placeholder="Your name" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input {...register("email")} type="email" placeholder="Your email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Textarea {...register("additionalInfo")} placeholder="Additional info" />
          </div>
          <div className="flex flex-row">
            <Button id="booking-submit" type="submit">Schedule event</Button>
            {errors.date && (
              <p className="text-destructive ml-2 mt-2">{errors.date.message}</p>
            )}
            {errors.time && (
              <p className="text-destructive ml-2 mt-2">{errors.time.message}</p>
            )}
          </div>
        </form>
      }
    </div>
  );
}

export default BookingForm