// @ts-nocheck
"use client";

import { Controller, Form, useForm, useWatch } from "react-hook-form";
import { DAYS_OF_WEEK_IN_ORDER, defaultAvailability } from "@/constants/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySchema } from "@/lib/validators";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateAvailability } from "@/actions/availability";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { SaveIcon } from "lucide-react";

interface FormProps {
  initialData: Partial<typeof defaultAvailability>
}

function AvailabilityForm({ initialData }: FormProps) {  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
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
    const response = await fnUpdateAvailability(data)
    if (response) window.alert("Availability changed successfully")
  }

  function renderDayInput(day: typeof availabilitySchema) {
    const isAvailable = useWatch({name: `${day}.isAvailable`, control})

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
              <FieldError className="text-destructive text-sm ml-2">
                {errors[day].endTime.message}
              </FieldError>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {DAYS_OF_WEEK_IN_ORDER.map(renderDayInput)}
      
      <Field className="flex flex-row items-center mt-5 w-full lg:w-1/2">
        <FieldLabel htmlFor="timegap-input">Minimum gap before bookings (mins)</FieldLabel>
        <Input id="timegap-input"
          type="number"
          {...register("timeGap", {
            valueAsNumber: true,
          })}
          className="bg-primary-foreground"
        />
      </Field>
      {errors.timeGap && (
        // error handling for time gap input
        <FieldError className="text-destructive text-sm -mt-5">{errors.timeGap.message}</FieldError>
      )}

      <div className="flex flex-row items-center space-x-4">
        <Button type="submit" disabled={loading}>
          {loading? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
          Save schedule
        </Button>
        {e && <FieldError className="text-destructive text-sm">{e.message}</FieldError>}
      </div>
    </form>
  );
}

export default AvailabilityForm;
