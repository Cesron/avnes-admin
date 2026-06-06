import { getSessionUserInfo } from "@/lib/auth-utils";
import { getWeekOccurrences } from "@/services/attendance/get-week-occurrences";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import {
  formatDateLocal,
  getMonthEnd,
  getMonthStart,
} from "@/utils/week-helpers";
import { AttendanceHeader } from "./_components/attendance-header";
import { AttendanceMonthView } from "./_components/attendance-month-view";

export default async function AttendancePage() {
  const userInfo = await getSessionUserInfo();

  const today = new Date();
  const monthStart = formatDateLocal(getMonthStart(today));
  const monthEnd = formatDateLocal(getMonthEnd(today));

  // Mentors only see their groups
  const mentorGroupIds =
    userInfo.role === "mentor" && userInfo.groupIds.length > 0
      ? userInfo.groupIds
      : undefined;

  const [clubs, groups] = await Promise.all([
    getClubsOptions(),
    getGroupsOptions(),
  ]);

  // If mentor, only show their groups in the filter dropdown
  const filteredGroups = mentorGroupIds
    ? groups.filter((g) => mentorGroupIds.includes(g.id))
    : groups;

  // Auto-select the single club/group when there's only one option, so the
  // initial load is already filtered and the filter UI can stay hidden.
  // Use the sentinel "all" for the multi-option case (user picks manually).
  const defaultClubId = clubs.length === 1 ? clubs[0].id : "all";
  const defaultGroupId =
    filteredGroups.length === 1 ? filteredGroups[0].id : "all";

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
    <>
      <AttendanceHeader />

      <div className="py-6">
        <AttendanceMonthView
          initialOccurrences={initialOccurrences}
          initialMonthStart={monthStart}
          clubs={clubs}
          groups={filteredGroups}
          mentorGroupIds={mentorGroupIds}
          defaultClubId={defaultClubId}
          defaultGroupId={defaultGroupId}
        />
      </div>
    </>
  );
}
