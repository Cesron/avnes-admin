import {
  BabyIcon,
  CalendarCheckIcon,
  CalendarClockIcon,
  CircleAlertIcon,
} from "lucide-react";
import { getMentorChildrenWithAttendance } from "@/services/dashboard/get-mentor-children-with-attendance";
import { getMentorOverview } from "@/services/dashboard/get-mentor-overview";
import { getMentorWeeklyTrend } from "@/services/dashboard/get-mentor-weekly-trend";
import {
  formatDateLocal,
  getMonthEnd,
  getMonthStart,
  getWeekMonday,
  getWeekSunday,
} from "@/utils/week-helpers";
import { AttendanceBars } from "./attendance-bars";
import { KpiCard } from "./kpi-card";
import { MentorChildrenList } from "./mentor-children-list";
import { TodayActivitiesCard } from "./today-activities-card";

type MentorDashboardProps = {
  groupIds: string[];
};

export async function MentorDashboard({ groupIds }: MentorDashboardProps) {
  const today = new Date();
  const monthStart = formatDateLocal(getMonthStart(today));
  const monthEnd = formatDateLocal(getMonthEnd(today));
  const weekStart = formatDateLocal(getWeekMonday(today));
  const weekEnd = formatDateLocal(getWeekSunday(today));

  const [overview, weeklyTrend, childrenList] = await Promise.all([
    getMentorOverview({ groupIds, monthStart, monthEnd }),
    getMentorWeeklyTrend({ groupIds, startDate: weekStart, endDate: weekEnd }),
    getMentorChildrenWithAttendance({
      groupIds,
      startDate: monthStart,
      endDate: monthEnd,
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Mis niños"
          value={overview.childrenCount}
          description="Niños asignados a mis grupos"
          icon={BabyIcon}
          iconClassName="bg-blue-500/10 text-blue-600"
        />
        <KpiCard
          title="Asistencia del mes"
          value={`${overview.attendancePct}%`}
          description={
            overview.attendanceTotal > 0
              ? `${overview.attendanceAttended} de ${overview.attendanceTotal} marcados`
              : "Sin registros este mes"
          }
          icon={CalendarCheckIcon}
          iconClassName="bg-emerald-500/10 text-emerald-600"
        />
        <KpiCard
          title="Próximas actividades"
          value={overview.upcomingActivities}
          description="En los siguientes 7 días"
          icon={CalendarClockIcon}
          iconClassName="bg-amber-500/10 text-amber-600"
        />
      </div>

      {/* Two-column section: today + weekly */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TodayActivitiesCard groupIds={groupIds} showClubs={false} />

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold leading-tight">Asistencia semanal</h3>
            <p className="text-sm text-muted-foreground">
              Porcentaje de asistencia por día
            </p>
          </div>
          <AttendanceBars
            data={weeklyTrend.map((p) => ({
              dayLabel: p.dayLabel,
              percentage: p.percentage,
              hasData: p.total > 0,
            }))}
          />
        </div>
      </div>

      {/* Children list */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <h3 className="font-semibold leading-tight">Mis niños</h3>
            <p className="text-sm text-muted-foreground">
              Porcentaje de asistencia en el mes
            </p>
          </div>
          {childrenList.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CircleAlertIcon className="size-3.5" />
              <span>Ordenados por menor asistencia</span>
            </div>
          )}
        </div>
        <MentorChildrenList items={childrenList} />
      </div>
    </div>
  );
}
