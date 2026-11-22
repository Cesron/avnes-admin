import { Suspense } from "react";
import { ListSkeleton } from "@/components/loading-skeletons";
import { getSessionUserInfo } from "@/lib/auth-utils";
import { type SearchParams, singleParam } from "@/lib/pagination";
import { getChildren } from "@/services/children/get-children";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getFamiliesOptions } from "@/services/families/get-families-options";
import type { GroupOption } from "@/services/groups/get-groups-options";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { ChildrenHeader } from "./_components/children-header";
import { ChildrenListView } from "./_components/children-list-view";
import { EditChildForm } from "./_components/edit-child-form";
import { EditChildProvider } from "./_context/edit-child-context";

export default async function ChildrenPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const userInfo = await getSessionUserInfo("/children");

  // Mentors see their own groups and children without an active group.
  const mentorGroupIds =
    userInfo.role === "mentor" ? userInfo.groupIds : undefined;

  const childrenPromise = getChildren({
    mentorGroupIds,
    search: singleParam(query.search),
    clubId: singleParam(query.clubId),
    groupId: singleParam(query.groupId),
    after: singleParam(query.after),
    before: singleParam(query.before),
  });
  const [familiesOptions, clubs, groups] = await Promise.all([
    getFamiliesOptions(
      userInfo.role === "mentor" ? userInfo.userId : undefined,
    ),
    getClubsOptions(),
    getGroupsOptions(),
  ]);

  // If mentor, only show their groups in the filter dropdown
  const filteredGroups = mentorGroupIds
    ? groups.filter((g) => mentorGroupIds.includes(g.id))
    : groups;

  return (
    <EditChildProvider>
      <ChildrenHeader familiesOptions={familiesOptions} />

      <div className="py-6">
        <Suspense fallback={<ListSkeleton kind="children" />}>
          <ChildResults
            childrenPromise={childrenPromise}
            clubs={clubs}
            groups={filteredGroups}
            isMentor={mentorGroupIds !== undefined}
          />
        </Suspense>
      </div>

      <EditChildForm familiesOptions={familiesOptions} groups={groups} />
    </EditChildProvider>
  );
}

async function ChildResults({
  childrenPromise,
  clubs,
  groups,
  isMentor,
}: {
  childrenPromise: ReturnType<typeof getChildren>;
  clubs: { id: string; name: string }[];
  groups: GroupOption[];
  isMentor: boolean;
}) {
  const children = await childrenPromise;

  return (
    <ChildrenListView
      initialChildren={children}
      clubs={clubs}
      groups={groups}
      isMentor={isMentor}
    />
  );
}
