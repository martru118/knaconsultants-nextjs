"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EventForm from "./EventForm";
import { useDrawer } from "@/hooks/use-drawer";

export default function CreateEventDrawer() {
  // expose global drawer state
  const data = useDrawer(state => state.initialData)
  const isOpen = useDrawer(state => state.isOpen)
  const closeDrawer = useDrawer(state => state.closeDrawer)

  return (
    <Drawer open={isOpen} onClose={closeDrawer}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new event</DrawerTitle>
        </DrawerHeader>

        <EventForm onSubmitForm={closeDrawer} initialData={data} />
      </DrawerContent>
    </Drawer>
  );
}