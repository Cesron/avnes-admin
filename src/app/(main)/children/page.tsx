import { getSessionUserInfo } from "@/lib/auth-utils";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { getChildren } from "@/services/children/get-children";
import { getFamiliesOptions } from "@/services/families/get-families-options";
import { ChildrenHeader } from "./_components/children-header";
import { ChildrenListView } from "./_components/children-list-view";
import { EditChildProvider } from "./_context/edit-child-context";
import { EditChildForm } from "./_components/edit-child-form";

export default async function ChildrenPage() {
  const userInfo = await getSessionUserInfo();

  // Mentors only see their groups
  const mentorGroupIds =
    userInfo.role === "mentor" && userInfo.groupIds.length > 0
      ? userInfo.groupIds
      : undefined;

  const [familiesOptions, clubs, groups, children] = await Promise.all([
    getFamiliesOptions(),
    getClubsOptions(),
    getGroupsOptions(),
    getChildren({ mentorGroupIds }),
  ]);

  // If mentor, only show their groups in the filter dropdown
  const filteredGroups = mentorGroupIds
    ? groups.filter((g) => mentorGroupIds.includes(g.id))
    : groups;

  return (
    <EditChildProvider>
      <ChildrenHeader familiesOptions={familiesOptions} />

      <div className="py-6">
        <ChildrenListView
          initialChildren={children}
          clubs={clubs}
          groups={filteredGroups}
          mentorGroupIds={mentorGroupIds}
        />
      </div>

      <EditChildForm familiesOptions={familiesOptions} />
    </EditChildProvider>
  );
}
