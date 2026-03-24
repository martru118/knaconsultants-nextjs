"use client"

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { eventSchema } from "@/lib/validators";
import { createEvent, updateEvent } from "@/actions/events";
import useFetch from "@/hooks/use-fetch";
import z from "zod";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";
import { Spinner } from "../ui/spinner";

interface FormProps {
  onSubmitForm: () => void,
  initialData?: {
    id: string,
    title: string,
    description: string,
    duration: number,
    isPrivate: boolean,
  },
}

function EventForm ({ onSubmitForm, initialData }: FormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: initialData?.id || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 30,
      isPrivate: initialData?.isPrivate ?? false,
    },
  });

  const { 
    loading, 
    error: e, 
    fn 
  } = initialData?.id.length ? useFetch(updateEvent) : useFetch(createEvent)

  // handle submit state
  async function onSubmit(data: z.infer<typeof eventSchema>) {
    await fn(data);

    // handle error state
    if (e) {
      setError("root", {
        message: e.message,
      })
    }

    // handle success state
    if (!loading && !e) onSubmitForm()
  };

  return (
    <form
      className="px-6 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel htmlFor="event-title">Title</FieldLabel>
            <Input id="event-title" {...register("title")} className="-mt-2" />
            {errors.title && (
              <p className="text-destructive text-sm -mt-2">{errors.title.message}</p>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-duration">Duration in minutes</FieldLabel>
            <Input
              id="event-duration"
              {...register("duration", {
                valueAsNumber: true,
              })}
              type="number"
              className="-mt-2"
            />
            {errors.duration && (
              <p className="text-destructive text-sm -mt-2">{errors.duration.message}</p>
            )}
          </Field>
        </div>

        <Field className="-mt-2">
          <FieldLabel htmlFor="event-description">Description</FieldLabel>
          <Textarea
            {...register("description")}
            id="description"
            className="-mt-2"
          />
          {errors.description && (
            <p className="text-destructive text-sm -mt-2">
              {errors.description.message}
            </p>
          )}
        </Field>

        <Field className="mb-4" orientation="horizontal">
          <Controller
            name="isPrivate"
            control={control}
            render={({ field }) =>
              <Switch id="event-isprivate" 
                checked={field.value}
                onCheckedChange={(checked) => {
                  setValue("isPrivate", checked)
                }}
              />
            }
          />
          <FieldLabel htmlFor="event-isprivate" className="text-md">Private</FieldLabel>

          {errors && <p className="text-destructive text-sm">{errors.root?.message}</p>}
          <Button type="submit" disabled={loading}>
            {loading? <Spinner data-icon="inline-start" /> : null}
            Save
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EventForm;
