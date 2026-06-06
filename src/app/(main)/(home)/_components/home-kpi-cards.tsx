import { BabyIcon, CalendarCheckIcon, CalendarDaysIcon } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { getAdminOverview } from "@/services/dashboard/get-admin-overview";
import {
  formatDateLocal,
  getMonthEnd,
  getMonthStart,
} from "@/utils/week-helpers";

export async function HomeKpiCards() {
  const today = new Date();
  const monthStart = formatDateLocal(getMonthStart(today));
  const monthEnd = formatDateLocal(getMonthEnd(today));

  const overview = await getAdminOverview({ monthStart, monthEnd });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <KpiCard
        label="Niños"
        value={overview.childrenCount}
        description="Niños registrados en el sistema"
        icon={BabyIcon}
        tone="blue"
        index={0}
      />
      <KpiCard
        label="Actividades"
        value={overview.activitiesCount}
        description="Actividades programadas"
        icon={CalendarDaysIcon}
        tone="purple"
        index={1}
      />
      <KpiCard
        label="Asistencia del mes"
        value={`${overview.attendancePct}%`}
        description={
          overview.attendanceTotal > 0
            ? `${overview.attendanceAttended} de ${overview.attendanceTotal} marcados`
            : "Sin registros este mes"
        }
        icon={CalendarCheckIcon}
        tone="green"
        progress={overview.attendancePct}
        index={2}
      />
    </div>
  );
}
