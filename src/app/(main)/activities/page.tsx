import { authorize } from "@/lib/auth-utils";
import { getActivities } from "@/services/activities/get-activities";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { ActivitiesCardsGrid } from "./_components/activities-cards-grid";
import { ActivitiesHeader } from "./_components/activities-header";
import { EditActivityForm } from "./_components/edit-activity-form";
import { EditActivityProvider } from "./_context/edit-activity-context";

export default async function ActivitiesPage() {
  await authorize("/activities");

  const [groupsOptions, activities] = await Promise.all([
    getGroupsOptions(),
    getActivities(),
  ]);

  return (
    <EditActivityProvider>
      <ActivitiesHeader groupsOptions={groupsOptions} />

      <div className="py-6">
        <ActivitiesCardsGrid activityList={activities} />
      </div>

      <EditActivityForm groupsOptions={groupsOptions} />
    </EditActivityProvider>
  );
}
