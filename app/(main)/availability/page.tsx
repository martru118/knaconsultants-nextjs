import { getUserAvailability } from "@/actions/availability";
import { Suspense } from "react";
import AvailabilityForm from "./_components/AvailabilityForm";
import { defaultAvailability } from "./data";

async function AvailabilityPage() {
  const availability: typeof defaultAvailability = await getUserAvailability()

  return (
    <div className="mx-auto">
      <Suspense fallback={<div>Loading availability...</div>}>
        <AvailabilityForm initialData={availability || defaultAvailability} />
      </Suspense>
    </div>
  );
}

export default AvailabilityPage;