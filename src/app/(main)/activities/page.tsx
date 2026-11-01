import { Suspense } from "react";
import { CardsSkeleton } from "@/components/loading-skeletons";
import { authorize } from "@/lib/auth-utils";
import { getActivities } from "@/services/activities/get-activities";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { ActivitiesCardsGrid } from "./_components/activities-cards-grid";
import { ActivitiesHeader } from "./_components/activities-header";
import { EditActivityForm } from "./_components/edit-activity-form";
import { EditActivityProvider } from "./_context/edit-activity-context";

export default async function ActivitiesPage() {
  await authorize("/activities");

  const activitiesPromise = getActivities();
  const groupsOptions = await getGroupsOptions();

  return (
    <EditActivityProvider>
      <ActivitiesHeader groupsOptions={groupsOptions} />

      <div className="py-6">
        <Suspense fallback={<CardsSkeleton kind="activities" />}>
          <ActivityResults activitiesPromise={activitiesPromise} />
        </Suspense>
      </div>

      <EditActivityForm groupsOptions={groupsOptions} />
    </EditActivityProvider>
  );
}

async function ActivityResults({
  activitiesPromise,
}: {
  activitiesPromise: ReturnType<typeof getActivities>;
}) {
  return <ActivitiesCardsGrid activityList={await activitiesPromise} />;
}
