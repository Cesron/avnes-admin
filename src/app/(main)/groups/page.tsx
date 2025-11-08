import { verifySession } from "@/lib/auth-utils";
import { GroupsHeader } from "./_components/groups-header";
import { GroupsTable } from "./_components/groups-table";
import { EditGroupProvider } from "./_context/edit-group-context";
import { EditGroupForm } from "./_components/edit-group-form";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getMentorsOptions } from "@/services/mentors/get-mentors-options";

export default async function GroupsPage() {
  await verifySession();

  const [clubs, mentors] = await Promise.all([
    getClubsOptions(),
    getMentorsOptions(),
  ]);

  return (
    <EditGroupProvider>
      <GroupsHeader />

      <GroupsTable />

      <EditGroupForm clubs={clubs} mentors={mentors} />
    </EditGroupProvider>
  );
}
