import { verifySession } from "@/lib/auth-utils";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getGroupsOptions } from "@/services/groups/get-groups-options";
import { getTodayActivities } from "@/services/attendance/get-today-activities";
import { AttendanceContent } from "./_components/attendance-content";
import { AttendanceHeader } from "./_components/attendance-header";

export default async function AttendancePage() {
  await verifySession();

  const today = new Date().toISOString().split("T")[0];

  const [clubs, groups, activities] = await Promise.all([
    getClubsOptions(),
    getGroupsOptions(),
    getTodayActivities({ date: today }),
  ]);

  return (
    <>
      <AttendanceHeader />

      <div className="py-6">
        <AttendanceContent
          initialActivities={activities}
          clubs={clubs}
          groups={groups}
        />
      </div>
    </>
  );
}
