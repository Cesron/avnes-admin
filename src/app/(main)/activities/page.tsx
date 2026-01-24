import { verifySession } from "@/lib/auth-utils";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { ActivitiesHeader } from "./_components/activities-header";
import { ActivitiesTable } from "./_components/activities-table";
import { EditActivityProvider } from "./_context/edit-activity-context";
import { EditActivityForm } from "./_components/edit-activity-form";

export default async function ActivitiesPage() {
  await verifySession();

  const groupsOptions = await getGroupsOptions();

  return (
    <EditActivityProvider>
      <ActivitiesHeader groupsOptions={groupsOptions} />

      <ActivitiesTable />

      <EditActivityForm groupsOptions={groupsOptions} />
    </EditActivityProvider>
  );
}
