import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EditChildForm } from "@/app/(main)/children/_components/edit-child-form";
import { EditChildProvider } from "@/app/(main)/children/_context/edit-child-context";
import { DashboardFilters } from "@/app/(main)/dashboard/_components/dashboard-filters";
import { ListSkeleton } from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { authorize } from "@/lib/auth-utils";
import { dashboardPeriod } from "@/lib/dashboard-period";
import { type SearchParams, singleParam } from "@/lib/pagination";
import { getChildren } from "@/services/children/get-children";
import { getFamiliesOptions } from "@/services/families/get-families-options";
import { getGroup } from "@/services/groups/get-group";
import { getGroupAttendance } from "@/services/groups/get-group-attendance";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { GroupAttendanceSummary } from "./_components/group-attendance-summary";
import { GroupChildrenList } from "./_components/group-children-list";
import { GroupDetailHeader } from "./_components/group-detail-header";

export default async function GroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  await authorize("/groups");
  const [{ groupId }, query] = await Promise.all([params, searchParams]);
  const group = await getGroup(groupId);
  if (!group) notFound();

  const viewInput = singleParam(query.view);
  const { view, period, current } = dashboardPeriod(
    viewInput,
    singleParam(viewInput === "month" ? query.month : query.week),
  );

  return (
    <>
      <GroupDetailHeader group={group} month={period.start.slice(0, 7)} />
      <div className="space-y-7 py-6">
        <DashboardFilters
          view={view}
          start={period.start}
          currentStart={current.start}
          today={current.today}
          pathname={`/groups/${group.id}`}
        />
        <Suspense
          key={`${view}:${period.start}`}
          fallback={<Skeleton className="h-72 rounded-xl" />}
        >
          <GroupOverview
            groupId={group.id}
            childrenCount={group.children_count}
            start={period.start}
            endExclusive={period.endExclusive}
          />
        </Suspense>
        <EditChildProvider>
          <Suspense fallback={<ListSkeleton kind="children" />}>
            <GroupChildren
              groupId={group.id}
              total={group.children_count}
              query={query}
            />
          </Suspense>
          <Suspense fallback={null}>
            <GroupChildEditor />
          </Suspense>
        </EditChildProvider>
      </div>
    </>
  );
}

async function GroupOverview({
  groupId,
  childrenCount,
  start,
  endExclusive,
}: {
  groupId: string;
  childrenCount: number;
  start: string;
  endExclusive: string;
}) {
  const summary = await getGroupAttendance(groupId, start, endExclusive);
  return (
    <GroupAttendanceSummary summary={summary} childrenCount={childrenCount} />
  );
}

async function GroupChildren({
  groupId,
  total,
  query,
}: {
  groupId: string;
  total: number;
  query: SearchParams;
}) {
  const children = await getChildren({
    groupId,
    search: singleParam(query.search),
    after: singleParam(query.after),
    before: singleParam(query.before),
  });
  return <GroupChildrenList childrenPage={children} total={total} />;
}

async function GroupChildEditor() {
  const [familiesOptions, groups] = await Promise.all([
    getFamiliesOptions(),
    getGroupsOptions(),
  ]);
  return <EditChildForm familiesOptions={familiesOptions} groups={groups} />;
}
