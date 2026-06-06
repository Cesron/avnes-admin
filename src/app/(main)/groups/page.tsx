import { authorize } from "@/lib/auth-utils";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getMentorsOptions } from "@/services/mentors/get-mentors-options";
import { EditGroupForm } from "./_components/edit-group-form";
import { GroupsHeader } from "./_components/groups-header";
import { GroupsList } from "./_components/groups-list";
import { EditGroupProvider } from "./_context/edit-group-context";

export default async function GroupsPage() {
  await authorize("/groups");

  const [clubs, mentors] = await Promise.all([
    getClubsOptions(),
    getMentorsOptions(),
  ]);

  return (
    <EditGroupProvider>
      <GroupsHeader />

      <div className="py-6">
        <GroupsList />
      </div>

      <EditGroupForm clubs={clubs} mentors={mentors} />
    </EditGroupProvider>
  );
}
