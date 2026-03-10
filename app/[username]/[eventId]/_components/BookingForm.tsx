import { EventDetails } from "@/actions/event-details";

interface BookingFormProps {
  currentEvent: EventDetails,
  availability: {
    date: string;
    slots: string[];
  }[]
}

export default function BookingForm({currentEvent, availability}: BookingFormProps) {
  return (
    <div>
      BookingForm
    </div>
  );
}