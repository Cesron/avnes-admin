import { Suspense } from "react";
import { HeaderSkeleton, ListSkeleton } from "@/components/loading-skeletons";
import { authorize } from "@/lib/auth-utils";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getMentorsOptions } from "@/services/mentors/get-mentors-options";
import { EditGroupForm } from "./_components/edit-group-form";
import { GroupsHeader } from "./_components/groups-header";
import { GroupsList } from "./_components/groups-list";
import { EditGroupProvider } from "./_context/edit-group-context";

export default async function GroupsPage() {
  await authorize("/groups");

  return (
    <EditGroupProvider>
      <Suspense fallback={<HeaderSkeleton />}>
        <GroupsHeader />
      </Suspense>

      <div className="py-6">
        <Suspense fallback={<ListSkeleton kind="groups" />}>
          <GroupsList />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <GroupEditor />
      </Suspense>
    </EditGroupProvider>
  );
}

async function GroupEditor() {
  const [clubs, mentors] = await Promise.all([
    getClubsOptions(),
    getMentorsOptions(),
  ]);

  return <EditGroupForm clubs={clubs} mentors={mentors} />;
}
