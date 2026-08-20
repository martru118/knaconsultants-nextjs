import { create } from "zustand";

interface DayPickerStore {
  selectedDate: Date,
  selectedTime?: string,
  duration: number,
  setDate: (date: Date) => void,
  setTime: (time?: string) => void,
  setDuration: (eventDuration: number) => void
}

export const useDayPicker = create<DayPickerStore>(set => ({
  selectedDate: new Date(),
  selectedTime: undefined,
  duration: 0,
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  setDuration: (eventDuration) => set({ duration: eventDuration })
}))