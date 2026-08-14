import { EventDetails } from "@/actions/event-details";
import { create } from "zustand";

interface DayPickerStore {
  selectedDate: Date,
  selectedTime?: string,
  setDate: (date: Date) => void,
  setTime: (time?: string) => void,

  currentlyBooking?: EventDetails | null,
  setBooking: (event: EventDetails) => void
}

export const useDayPicker = create<DayPickerStore>(set => ({
  selectedDate: new Date(),
  selectedTime: undefined,
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  
  currentlyBooking: null,
  setBooking: (event: EventDetails) => set({ currentlyBooking: event })
}))