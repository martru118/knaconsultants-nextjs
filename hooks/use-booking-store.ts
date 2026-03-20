import { create } from "zustand";

interface BookingStore {
  selectedDate: Date,
  selectedTime?: string,
  setDate: (date: Date) => void,
  setTime: (time?: string) => void,
}

export const useBookingStore = create<BookingStore>(set => ({
  selectedDate: new Date(),
  selectedTime: undefined,
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
}))