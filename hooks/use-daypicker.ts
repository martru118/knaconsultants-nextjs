import { create } from "zustand";

type MeetingResponse = {
  success: boolean,
  booking?: string | null
}

interface DayPickerStore {
  selectedDate: Date,
  selectedTime?: string,
  duration: number,
  setDate: (date: Date) => void,
  setTime: (time?: string) => void,
  setDuration: (eventDuration: number) => void,

  // handle response from server
  response: boolean,
  booking?: string | null,
  setBooking: (bookingData: MeetingResponse) => void,
}

export const useDayPicker = create<DayPickerStore>(set => ({
  selectedDate: new Date(),
  selectedTime: undefined,
  duration: 0,
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  setDuration: (eventDuration) => set({ duration: eventDuration }),

  response: false,
  booking: undefined,
  setBooking: (bookingData) => set({
    response: bookingData.success,
    booking: bookingData.booking
  })
}))