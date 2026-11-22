import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AttendanceSkeleton } from "@/components/loading-skeletons";
import type { SessionUserInfo } from "@/lib/auth-utils";
import { getSessionUserInfo } from "@/lib/auth-utils";
import { dashboardMonth } from "@/lib/dashboard-period";
import { type SearchParams, singleParam } from "@/lib/pagination";
import { getWeekOccurrences } from "@/services/attendance/get-week-occurrences";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { AttendanceHeader } from "./_components/attendance-header";
import { AttendanceMonthView } from "./_components/attendance-month-view";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userInfo = await getSessionUserInfo("/attendance");

  return (
    <>
      <AttendanceHeader />

      <div className="py-6">
        <Suspense fallback={<AttendanceSkeleton />}>
          <AttendanceContent userInfo={userInfo} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function AttendanceContent({
  userInfo,
  searchParams,
}: {
  userInfo: SessionUserInfo;
  searchParams: Promise<SearchParams>;
}) {
  // Mentors only see their groups
  const mentorGroupIds =
    userInfo.role === "mentor" ? userInfo.groupIds : undefined;

  const [query, clubs, groups] = await Promise.all([
    searchParams,
    getClubsOptions(),
    getGroupsOptions(),
  ]);

  // If mentor, only show their groups in the filter dropdown
  const filteredGroups = mentorGroupIds
    ? groups.filter((g) => mentorGroupIds.includes(g.id))
    : groups;

  const groupInput = singleParam(query.groupId);
  const requestedGroup = filteredGroups.find(
    (group) => group.id === groupInput,
  );
  if (groupInput && groupInput !== "all" && !requestedGroup) notFound();
  const { start: monthStart, end: monthEnd } = dashboardMonth(
    singleParam(query.month),
  );

  // Honor the group link before applying the usual single-option defaults.
  const defaultClubId = clubs.length === 1 ? clubs[0].id : "all";
  const defaultGroupId =
    requestedGroup?.id ??
    (groupInput !== "all" && filteredGroups.length === 1
      ? filteredGroups[0].id
      : "all");

  // Apply those defaults to the initial query as well, so the first render
  // already reflects the right scope.
  const initialClubId = defaultClubId === "all" ? undefined : defaultClubId;
  const initialGroupId = defaultGroupId === "all" ? undefined : defaultGroupId;

  const initialOccurrences = await getWeekOccurrences({
    startDate: monthStart,
    endDate: monthEnd,
    clubId: initialClubId,
    groupId: initialGroupId,
    mentorGroupIds,
  });

  return (
    <AttendanceMonthView
      key={`${monthStart}:${defaultClubId}:${defaultGroupId}`}
      initialOccurrences={initialOccurrences}
      initialMonthStart={monthStart}
      clubs={clubs}
      groups={filteredGroups}
      defaultClubId={defaultClubId}
      defaultGroupId={defaultGroupId}
    />
  );
}
