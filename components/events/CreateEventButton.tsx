"use client"

import { PenBox } from "lucide-react";
import { Button } from "../ui/button";
import { useDrawer } from "@/hooks/use-drawer";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  isSidebar?: boolean   // show wide button in sidebar
}

export default function CreateEventButton({isSidebar=false}: ActionButtonProps) {
  const openDrawer = useDrawer(state => state.openDrawer)
  
  // drawer trigger
  return (
    <Button 
      onClick={openDrawer}
      className={cn(
        "flex items-center gap-2",
        isSidebar? "w-full" : ""
      )}
    >
      <PenBox size={18} />
      Create Event
    </Button>
  );
}