"use client"

import { PenBox } from "lucide-react";
import { Button } from "../ui/button";
import { useDrawer } from "@/hooks/use-drawer";

export default function CreateEventButton() {
  const openDrawer = useDrawer(state => state.openDrawer)
  
  // drawer trigger
  return (
    <Button 
      onClick={openDrawer}
      className="flex items-center gap-2"
    >
      <PenBox size={18} />
      Create Event
    </Button>
  );
}