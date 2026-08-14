"use client"

import { createBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useDayPicker } from "@/hooks/use-daypicker";
import useFetch from "@/hooks/use-fetch";
import { bookingSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { parse } from "date-fns/parse";
import { useForm } from "react-hook-form";
import z from "zod";

interface BookingInterface {
  dateKey: string,  // selected date as booking key
}

export function BookingInput({ dateKey }: BookingInterface) {
  // disable form if no time is selected
  const selectedDate = useDayPicker(state => state.selectedDate)
  const selectedTime = useDayPicker(state => state.selectedTime)
  const currentlyBooking = useDayPicker(state => state.currentlyBooking)
  const isDisabled = !selectedTime

  const {
    loading, 
    error: e,
  } = useFetch(createBooking)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  // validate full schema on submit
  async function onSubmit(data: z.infer<typeof bookingSchema>) {
    if (!selectedDate || !selectedTime) {
      setError("root", { message: "Date or time not selected" })
      return
    }

    // format am/pm time to utc
    const ampm = parse(selectedTime, "hh:mm a", new Date())
    const formattedTime = format(ampm, "HH:mm")

    // format start and end times
    const startTime = new Date(`${dateKey}T${formattedTime}`)
    const endTime = new Date(startTime.getTime() + currentlyBooking!.duration*60000)

    // prepare booking data object
    const bookingData = {
      eventId: currentlyBooking!.id,
      name: data.name,
      email: data.email,
      startTime,
      endTime,
      additionalInfo: data.additionalInfo,
    }

    //console.log(startTime.toISOString())
    console.log(bookingData)
    //await fnCreateBooking(bookingData)

    // handle error state
    if (e) {
      setError("root", {
        message: e.message
      })
    }
  }

  return <form className="pt-10 max-w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="attendee-name">
          Name <span className="text-destructive">*</span>
        </FieldLabel>
        <Input id="attendee-name"
          {...register("name")} 
          placeholder="Your name" 
          required
          disabled={isDisabled}
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
          disabled={isDisabled}
          className="-mt-2"
        />
      </Field>
    </FieldGroup>
    <Field>
      <FieldLabel htmlFor="booking-info">Additional info</FieldLabel>
      <Textarea id="booking-info"
        {...register("additionalInfo")} 
        placeholder="What would you like to discuss?" 
        disabled={isDisabled}
        className="-mt-2 overflow-y-auto"
      />
    </Field>

    {!isDisabled && <p>You have selected {dateKey} at {selectedTime}</p>}
    <div id="booking-submit" className="flex flex-col">
      <Button 
        type="submit"
        disabled={loading || isDisabled}
        className="w-full"
      >
        {loading? <Spinner data-icon="inline-start" /> : null}
        Schedule event
      </Button>
      {errors && (
        <p className="text-destructive text-sm mt-2">{errors.root?.message}</p>
      )}
    </div>
  </form>
}