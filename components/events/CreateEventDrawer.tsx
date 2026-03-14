"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EventForm from "./EventForm";

export default function CreateEventDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // create event on param trigger
  useEffect(() => {
    const create = searchParams.get("create");
    if (create === "true") setIsOpen(true);
  }, [searchParams]);

  {/* State can be exposed to our app in case we want to manually open the drawer 👇
    useEffect(() => {
      window.openCreateEventDrawer = () => setIsOpen(true);
      return () => {delete window.openCreateEventDrawer};
    }, []);
  */}

  // remove params and close drawer
  function handleClose() {
    setIsOpen(false);
    if (searchParams.get("create") === "true") {
      router.replace(window?.location.pathname);
    }
  };

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new event</DrawerTitle>
        </DrawerHeader>

        <EventForm onSubmitForm={handleClose} />
      </DrawerContent>
    </Drawer>
  );
}