import { getUserAvailability } from "@/actions/availability";
import { Suspense } from "react";
import AvailabilityForm from "./_components/availability-form";
import { defaultAvailability } from "@/constants/constants";
import { AppLoader } from "@/components/dashboard/AppLoader";

async function AvailabilityPage() {
  const availability = await getUserAvailability()

  return (
    <div className="mx-auto">
      <Suspense fallback={<AppLoader />}>
        <AvailabilityForm initialData={availability || defaultAvailability} />
      </Suspense>
    </div>
  );
}

export default AvailabilityPage;