import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventSchema } from "@/lib/validators";
import { createEvent } from "@/actions/events";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import z from "zod";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

interface FormProps {
  onSubmitForm: any,
  initialData?: {
    title: string,
    description: string,
    duration: number,
    isPrivate: boolean,
  },
}

function EventForm ({ onSubmitForm, initialData }: FormProps) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 30,
      isPrivate: initialData?.isPrivate ?? false,
    },
  });

  const { 
    loading, 
    error: e, 
    fn: fnCreateEvent 
  } = useFetch(createEvent);

  // handle submit state
  async function onSubmit(data: z.infer<typeof eventSchema>) {
    await fnCreateEvent(data);
    if (!loading && !e) onSubmitForm();
    router.refresh(); // refresh the page to show updated data
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
              <p className="text-red-500 text-xs -mt-1">{errors.title.message}</p>
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
              <p className="text-red-500 text-xs -mt-1">{errors.duration.message}</p>
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
            <p className="text-red-500 text-xs -mt-1">
              {errors.description.message}
            </p>
          )}
        </Field>

        <Field orientation="horizontal">
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

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Create Event"}
          </Button>
        </Field>
        {errors && <p className="text-red-500 text-xs mt-1">{errors.root?.message}</p>}
      </FieldGroup>
    </form>
  );
};

export default EventForm;
