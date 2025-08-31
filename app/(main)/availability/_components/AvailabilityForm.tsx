"use client"

import { defaultAvailability } from "../data";

interface FormProps {
  initialData: typeof defaultAvailability
}

function AvailabilityForm({initialData}: FormProps) {  
  return (
    <div>
      AvailabilityForm
    </div>
  );
}

export default AvailabilityForm;