import { getUserAvailability } from "@/actions/availability";
import { Suspense } from "react";
import AvailabilityForm from "./_components/availability-form";
import { defaultAvailability } from "../../../constants/constants";

async function AvailabilityPage() {
  const availability = await getUserAvailability()

  return (
    <div className="mx-auto">
      <Suspense fallback={<div>Loading availability...</div>}>
        <AvailabilityForm initialData={availability || defaultAvailability} />
      </Suspense>
    </div>
  );
}

export default AvailabilityPage;