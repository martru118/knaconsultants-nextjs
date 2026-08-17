"use client"

import { createBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { spokenLanguages } from "@/constants/constants";
import { useDayPicker } from "@/hooks/use-daypicker";
import useFetch from "@/hooks/use-fetch";
import { bookingSchema, BookingSchemaType } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { parse } from "date-fns/parse";
import { CalendarDays } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

interface BookingInterface {
  dateKey: string,  // selected date as booking key
}

export function BookingInput({ dateKey }: BookingInterface) {
  // disable form if no time is selected
  const selectedDate = useDayPicker(state => state.selectedDate)
  const selectedTime = useDayPicker(state => state.selectedTime)
  const eventInfo = useDayPicker(state => state.eventInfo)
  const isDisabled = !selectedTime

  const {
    loading, 
    error: e,
  } = useFetch(createBooking)

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<BookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      language: "en"
    }
  });

  // validate full schema on submit
  async function onSubmit(data: BookingSchemaType) {
    if (!selectedDate || !selectedTime) {
      setError("root", { message: "Date or time not selected" })
      return
    }

    // format am/pm time to utc
    const ampm = parse(selectedTime, "hh:mm a", new Date())
    const formattedTime = format(ampm, "HH:mm")

    // format start and end times
    const startTime = new Date(`${dateKey}T${formattedTime}`)
    const endTime = new Date(startTime.getTime() + eventInfo!.duration*60000)

    // prepare booking data object
    const bookingData = {
      eventId: eventInfo!.id,
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
    <FieldGroup className="-space-y-4">
      {/* Name field */}
      <Field>
        <FieldLabel htmlFor="attendee-name">
          Full name <span className="text-destructive">*</span>
        </FieldLabel>
        <Input id="attendee-name"
          {...register("name")} 
          placeholder="Your name" 
          required
          disabled={isDisabled}
          className="-mt-2"
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        {/* Email field */}
        <Field>
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

        {/* Phone number field */}
        <Field>
          <FieldLabel htmlFor="attendee-phone">
            Phone <span className="text-destructive">*</span>
          </FieldLabel>
          <Input id="attendee-phone"
            {...register("phone")} 
            placeholder="Your phone number"
            required
            disabled={isDisabled}
            className="-mt-2"
          />
        </Field>
      </div>

      {/* Language picker field */}
      <Field>
        <FieldLabel htmlFor="select-language">Spoken language</FieldLabel>
        <FieldDescription className="-mt-3 -mb-2">
          For best results, select the language you speak.
        </FieldDescription>
        <Controller 
          name="language" 
          control={control}
          render={( { field }) => (
            <Select
              disabled={isDisabled}
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="select-language"
                className="min-w-[120px]"
              >
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectGroup>
                  {spokenLanguages.map(locale => (
                    // map locale to language label for selector
                    <SelectItem key={locale.value} value={locale.value}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
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
      <div className="grid grid-cols-2 gap-2">
        <Button 
          type="submit"
          disabled={loading || isDisabled}
          className="w-full"
        >
          {loading? <Spinner data-icon="inline-start" /> : <CalendarDays data-icon="inline-start" />}
          Schedule event
        </Button>
        <Button 
          type="button"
          variant="secondary"
          disabled={loading}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
      {errors && (
        <p className="text-destructive text-sm mt-2">{errors.root?.message}</p>
      )}
    </div>
  </form>
}