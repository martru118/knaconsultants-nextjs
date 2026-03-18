import { eventSchema } from "@/lib/validators";
import z from "zod";
import { create } from "zustand";

interface EventDrawerStore {
  isOpen: boolean,
  initialData?: z.infer<typeof eventSchema>,
  openDrawer: () => void,
  closeDrawer: () => void,
  setEvent: (event: z.infer<typeof eventSchema>) => void,
}

export const useDrawer = create<EventDrawerStore>((set) => ({
  isOpen: false,
  initialData: undefined,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ 
    // reset state when drawer closes
    isOpen: false,
    initialData: undefined,
  }),
  // set initial data when editing
  setEvent: (event) => set({ initialData: event }),
}));
