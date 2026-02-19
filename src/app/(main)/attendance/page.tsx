import { getSessionUserInfo } from "@/lib/auth-utils";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { getWeekOccurrences } from "@/services/attendance/get-week-occurrences";
import {
  formatDateLocal,
  getWeekMonday,
  getWeekSunday,
} from "@/utils/week-helpers";
import { AttendanceWeekView } from "./_components/attendance-week-view";
import { AttendanceHeader } from "./_components/attendance-header";

export default async function AttendancePage() {
  const userInfo = await getSessionUserInfo();

  const today = new Date();
  const weekStart = formatDateLocal(getWeekMonday(today));
  const weekEnd = formatDateLocal(getWeekSunday(today));

  // Mentors only see their groups
  const mentorGroupIds =
    userInfo.role === "mentor" && userInfo.groupIds.length > 0
      ? userInfo.groupIds
      : undefined;

  const [clubs, groups, occurrences] = await Promise.all([
    getClubsOptions(),
    getGroupsOptions(),
    getWeekOccurrences({
      startDate: weekStart,
      endDate: weekEnd,
      mentorGroupIds,
    }),
  ]);

  // If mentor, only show their groups in the filter dropdown
  const filteredGroups = mentorGroupIds
    ? groups.filter((g) => mentorGroupIds.includes(g.id))
    : groups;

  return (
    <>
      <AttendanceHeader />

      <div className="py-6">
        <AttendanceWeekView
          initialOccurrences={occurrences}
          initialWeekStart={weekStart}
          clubs={clubs}
          groups={filteredGroups}
          mentorGroupIds={mentorGroupIds}
        />
      </div>
    </>
  );
}
