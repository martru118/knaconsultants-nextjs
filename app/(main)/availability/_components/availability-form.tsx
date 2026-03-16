// @ts-nocheck
"use client";

import { Controller, Form, useForm } from "react-hook-form";
import { DAYS_OF_WEEK_IN_ORDER, defaultAvailability } from "../constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySchema } from "@/lib/validators";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateAvailability } from "@/actions/availability";
import z from "zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface FormProps {
  initialData: typeof defaultAvailability;
}

function AvailabilityForm({ initialData }: FormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {errors},
  } = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {...initialData},
  })

  const {
    fn: fnUpdateAvailability,
    loading,
    error: e,
  } = useFetch(updateAvailability)

  async function onSubmit(data: z.infer<typeof availabilitySchema>) {
    await fnUpdateAvailability(data)
  }

  function renderDayInput(day: typeof availabilitySchema) {
    const isAvailable = watch(`${day}.isAvailable`)

    return (
      <div key={day} className="flex items-center space-x-2 mb-4">
        <Controller
          name={`${day}.isAvailable`}
          control={control}
          render={({ field }) => {
            return (
              <Checkbox
                className="border-2 bg-white outline-black"
                checked={field.value}
                onCheckedChange={(checked) => {
                  setValue(`${day}.isAvailable`, checked);

                  // set default times for unchecked days
                  if (!checked) {
                    setValue(`${day}.startTime`, "09:00")
                    setValue(`${day}.endTime`, "17:00")
                  }
                }}
              />
            );
          }}
        />
        <span className="capitalize font-semibold w-28">{day}</span>

        {isAvailable && (
          // availability time pickers
          <div>
            <FieldGroup className="flex-row w-32">
              <Field>
                <Input
                  type="time"
                  {...register(`${day}.startTime`)}
                  className="w-32 bg-background"
                />
              </Field>
              <span className="mt-1.5 -mx-4">to</span>
              <Field>
                <Input
                  type="time"
                  {...register(`${day}.endTime`)}
                  className="w-32 bg-background"
                />
              </Field>
            </FieldGroup>

            {errors[day]?.endTime && (
              <span className="text-destructive text-sm ml-2">
                {errors[day].endTime.message}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {DAYS_OF_WEEK_IN_ORDER.map(renderDayInput)}
      
      <div className="flex items-center space-x-4 mt-5">
        <span className="w-48">Minimum gap before bookings (mins.):</span>
        <Input
          type="number"
          {...register("timeGap", {
            valueAsNumber: true,
          })}
          className="w-32 bg-white"
        />

        {errors.timeGap && (
          // error handling for time gap input
          <p className="text-red-500 text-xs mt-1">{errors.timeGap.message}</p>
        )}
      </div>

      {e && <p className="text-red-500 text-xs mt-1">{e}</p>}
      <Button type="submit" disabled={loading}>
        {loading? <Spinner data-icon="inline-start" /> : null}
        Update schedule
      </Button>
    </form>
  );
}

export default AvailabilityForm;
