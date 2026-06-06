import {
  BabyIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  TrophyIcon,
} from "lucide-react";
import { getAdminOverview } from "@/services/dashboard/get-admin-overview";
import { getClubAttendance } from "@/services/dashboard/get-club-attendance";
import { getGroupAttendanceRanking } from "@/services/dashboard/get-group-attendance-ranking";
import { getLowAttendanceChildren } from "@/services/dashboard/get-low-attendance-children";
import {
  formatDateLocal,
  getMonthEnd,
  getMonthStart,
} from "@/utils/week-helpers";
import { ClubAttendanceList } from "./club-attendance-list";
import { GroupRanking } from "./group-ranking";
import { KpiCard } from "./kpi-card";
import { LowAttendanceAlert } from "./low-attendance-alert";
import { TodayActivitiesCard } from "./today-activities-card";

export async function AdminDashboard() {
  const today = new Date();
  const monthStart = formatDateLocal(getMonthStart(today));
  const monthEnd = formatDateLocal(getMonthEnd(today));

  const [overview, clubAttendance, topGroups, lowAttendance] =
    await Promise.all([
      getAdminOverview({ monthStart, monthEnd }),
      getClubAttendance({ startDate: monthStart, endDate: monthEnd }),
      getGroupAttendanceRanking({
        startDate: monthStart,
        endDate: monthEnd,
        limit: 5,
        order: "top",
      }),
      getLowAttendanceChildren({
        startDate: monthStart,
        endDate: monthEnd,
        threshold: 70,
        limit: 5,
      }),
    ]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Niños"
          value={overview.childrenCount}
          icon={BabyIcon}
          iconClassName="bg-blue-500/10 text-blue-600"
        />
        <KpiCard
          title="Actividades"
          value={overview.activitiesCount}
          icon={CalendarDaysIcon}
          iconClassName="bg-violet-500/10 text-violet-600"
        />
        <KpiCard
          title="Asistencia del mes"
          value={`${overview.attendancePct}%`}
          description={
            overview.attendanceTotal > 0
              ? `${overview.attendanceAttended} de ${overview.attendanceTotal}`
              : "Sin registros este mes"
          }
          icon={CalendarCheckIcon}
          iconClassName="bg-emerald-500/10 text-emerald-600"
        />
      </div>

      {/* Today activities + low attendance alert */}
      <div className="grid gap-4 lg:grid-cols-3">
        <TodayActivitiesCard
          groupIds={[]}
          showClubs
          className="lg:col-span-2"
        />
        <LowAttendanceAlert items={lowAttendance} />
      </div>

      {/* Club attendance + top groups ranking */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ClubAttendanceList clubs={clubAttendance} />
        <GroupRanking
          groups={topGroups}
          icon={TrophyIcon}
          title="Top 5 grupos con mejor asistencia"
          emptyMessage="Aún no hay datos de asistencia"
        />
      </div>
    </div>
  );
}
