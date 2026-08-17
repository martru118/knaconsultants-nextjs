"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDayPicker } from "@/hooks/use-daypicker";
import { addDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { booking } from "@/public/locales/en/common.json"

const today = new Date()

interface DayPickerProps {
  availabilities: Date[]
  slots: string[] 
}

export function BookingDayPicker({ availabilities, slots }: DayPickerProps) {
  const selectedDate = useDayPicker(state => state.selectedDate)
  const selectedTime = useDayPicker(state => state.selectedTime)
  const setDate = useDayPicker(state => state.setDate)
  const setTime = useDayPicker(state => state.setTime)

  return <div className="md:h-90 flex flex-col md:flex-row gap-5">
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
          available: availabilities,
        }}
        modifiersClassNames={{
          available: `bg-indigo-200 w-10 h-10 rounded-full`,
        }}
      />
    </div>
    <Separator className="lg:visible" orientation="vertical" />

    <div className="max-w-full h-full mt-2 md:overflow-scroll no-scrollbar">
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-2">
          {booking.heading}
        </h3>
        {!slots.length && (
          <p className="text-md">{booking.empty}</p>
        )}
        {selectedDate && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {slots.map(slot => {
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
}