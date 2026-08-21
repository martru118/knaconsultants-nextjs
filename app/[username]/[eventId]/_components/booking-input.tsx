"use client"

import { createBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useDayPicker } from "@/hooks/use-daypicker";
import useFetch from "@/hooks/use-fetch";
import { converttoUTC } from "@/lib/helper";
import { bookingSchema, BookingSchemaType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, CalendarDays } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { booking } from "@/public/locales/en/common.json"

interface BookingInterface {
  dateKey: string,  // selected date as booking key
}

export function BookingInput({ dateKey }: BookingInterface) {
  const selectedTime = useDayPicker(state => state.selectedTime)
  const duration = useDayPicker(state => state.duration)

  // handle form cancellation
  const {username, eventId} = useParams()
  const router = useRouter()

  // disable form if time has not been selected
  const {
    loading, 
    error: e,
  } = useFetch(createBooking)
  const isDisabled = !selectedTime || loading

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<BookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: dateKey,
    }
  });

  // manually validate selected time
  useEffect(() => {
    if (selectedTime) setValue("time", selectedTime)
  }, [selectedTime])

  // validate full schema on submit
  async function onSubmit(data: BookingSchemaType) {
    if (!dateKey || !selectedTime) {
      setError("root", { message: "Date or time not selected" })
      return
    }

    // format start and end times to utc
    const startTime = converttoUTC(selectedTime, dateKey)
    const endTime = new Date(startTime.getTime() + duration*60000)

    // prepare booking data object
    const bookingData = {
      eventId: eventId,
      name: data.name,
      email: data.email,
      startTime,
      endTime,
      additionalInfo: data.additionalInfo,
    }

    console.log(bookingData)
    //await fnCreateBooking(bookingData)

    // handle error state
    if (e) {
      setError("root", {
        message: e.message
      })
    }
  }

  // handle form errors on submit
  function onInvalid(errors: FieldErrors) {
    console.error("Form error:", errors)
  }

  return <form className="pt-10 max-w-full space-y-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
    <FieldGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Name field */}
        <Field>
          <FieldLabel htmlFor="attendee-name">
            {booking.fields.at(0)?.title} <Asterisk className="text-destructive w-3 h-3 mb-2 -ml-1" />
          </FieldLabel>
          <Input id="attendee-name"
            {...register("name")} 
            placeholder={booking.fields.at(0)?.hint}
            required
            disabled={isDisabled}
            className="-mt-2"
          />
          {errors.name && (
            <FieldError className="text-xs -mt-2 text-destructive">{errors.name.message}</FieldError>
          )}
        </Field>

        {/* Email field */}
        <Field>
          <FieldLabel htmlFor="attendee-email">
          {booking.fields.at(1)?.title} <Asterisk className="text-destructive w-3 h-3 mb-2 -ml-1" />
          </FieldLabel>
          <Input id="attendee-email"
            {...register("email")} 
            type="email" 
            placeholder={booking.fields.at(1)?.hint}
            required
            disabled={isDisabled}
            className="-mt-2"
          />
          {errors.email && (
            <FieldError className="text-xs -mt-2 text-destructive">{errors.email.message}</FieldError>
          )}
        </Field>
      </div>
    </FieldGroup>
    <Field>
      <FieldLabel htmlFor="booking-info">{booking.fields.at(2)?.title}</FieldLabel>
      <Textarea id="booking-info"
        {...register("additionalInfo")}
        placeholder={booking.fields.at(2)?.hint}
        disabled={isDisabled}
        className="-mt-2 overflow-y-auto"
      />
      {errors.additionalInfo && (
        <FieldError className="text-xs -mt-2 text-destructive">{errors.additionalInfo.message}</FieldError>
      )}
    </Field>

    {!isDisabled && <p>You have selected {dateKey} at {selectedTime}</p>}
    <div id="booking-submit" className="flex flex-col">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          type="submit"
          disabled={isDisabled}
          className="w-full"
        >
          {loading? <Spinner data-icon="inline-start" /> : <CalendarDays data-icon="inline-start" />}
          {booking.action}
        </Button>
        <Button 
          type="button"
          variant="secondary"
          disabled={loading}
          className="w-full"
          onClick={() => router.push(`/${username}`)}
        >
          {booking.secondary}
        </Button>
      </div>
      {errors.root && (
        <FieldError className="text-sm text-destructive">{errors.root?.message}</FieldError>
      )}
    </div>
  </form>
}