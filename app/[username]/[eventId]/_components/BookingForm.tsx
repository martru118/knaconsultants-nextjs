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
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState,
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
  const availableDays = availability.map(day => new Date(day.date))

  // fetch available time slots for particular day
  const timeSlots = selectedDate
    ? availability.find(
      day => day.date === format(selectedDate, dateFormat)
    )?.slots || []
  : []

  return (
    <div className="flex flex-col p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker 
            mode="single" 
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
                    onClick={() => setSelectedTime(slot)}
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input {...register("name")} placeholder="Your name" />
            {formState.errors.name && (
              <p className="text-red-500 text-sm">{formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Input {...register("email")} type="email" placeholder="Your email" />
            {formState.errors.name && (
              <p className="text-red-500 text-sm">{formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Textarea {...register("additionalInfo")} placeholder="Additional info" />
          </div>
          <Button type="submit">Schedule event</Button>
        </form>
      }
    </div>
  );
}

export default BookingForm