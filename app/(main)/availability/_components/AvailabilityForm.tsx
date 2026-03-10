// @ts-nocheck
"use client";

import { Controller, useForm } from "react-hook-form";
import { DAYS_OF_WEEK, defaultAvailability, timeSlots } from "../data";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySchema } from "@/lib/validators";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateAvailability } from "@/actions/availability";

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
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const {
    fn: fnUpdateAvailability,
    loading,
    error: e,
  } = useFetch(updateAvailability)

  const onSubmit = async(data) => {
    await fnUpdateAvailability(data)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {DAYS_OF_WEEK.map((day) => {
        // watch for state changes
        const isAvailable = watch(`${day}.isAvailable`);

        return (
          <div key={day} className="flex items-center space-x-4 mb-4">
            <Controller
              name={`${day}.isAvailable`}
              control={control}
              render={({ field }) => {
                return (
                  <Checkbox
                    className="border-2 bg-white"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      setValue(`${day}.isAvailable`, checked);

                      // when not checked
                      if (!checked) {
                        setValue(`${day}.startTime`, "09:00");
                        setValue(`${day}.endTime`, "17:00");
                      }
                    }}
                  />
                );
              }}
            />
            <span className="capitalize w-24">{day}</span>

            {isAvailable && (
              <>
                <Controller
                  name={`${day}.startTime`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32 bg-white">
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => {
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                <span>to</span>
                <Controller
                  name={`${day}.endTime`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32 bg-white">
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => {
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />

                {errors[day]?.endTime && (
                  // error handling for availability dropdown
                  <p className="text-red-500 text-xs mt-1">
                    {errors[day].endTime.message}
                  </p>
                )}
              </>
            )}
          </div>
        );
      })}

      <div className="flex items-center space-x-4">
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
      <Button className="mt-5" type="submit" disabled={loading}>
        {loading? "Updating..." : "Update schedule"}
      </Button>
    </form>
  );
}

export default AvailabilityForm;
