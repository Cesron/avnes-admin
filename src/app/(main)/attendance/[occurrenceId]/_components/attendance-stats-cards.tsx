import {
  CalendarCheck2Icon,
  CalendarX2Icon,
  ClockAlertIcon,
  UsersIcon,
} from "lucide-react";
import { KpiCard, type KpiTone } from "@/components/kpi-card";

interface AttendanceStatsCardsProps {
  total: number;
  present: number;
  absent: number;
  excused: number;
}

interface StatConfig {
  key: "total" | "present" | "absent" | "excused";
  label: string;
  icon: typeof UsersIcon;
  tone: KpiTone;
}

const STAT_CONFIG: readonly StatConfig[] = [
  { key: "total", label: "Total de niños", icon: UsersIcon, tone: "blue" },
  {
    key: "present",
    label: "Presentes",
    icon: CalendarCheck2Icon,
    tone: "green",
  },
  { key: "absent", label: "Ausentes", icon: CalendarX2Icon, tone: "red" },
  { key: "excused", label: "Permisos", icon: ClockAlertIcon, tone: "amber" },
] as const;

export function AttendanceStatsCards({
  total,
  present,
  absent,
  excused,
}: AttendanceStatsCardsProps) {
  const values: Record<StatConfig["key"], number> = {
    total,
    present,
    absent,
    excused,
  };

  // Use a non-zero denominator so a 0/0 split renders as 0%, not NaN%.
  const denominator = total > 0 ? total : 1;
  const pct = (value: number) => Math.round((value / denominator) * 100);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {STAT_CONFIG.map((stat, index) => {
        const value = values[stat.key];
        const isTotal = stat.key === "total";

        return (
          <KpiCard
            key={stat.key}
            label={stat.label}
            value={value}
            description={
              isTotal ? "Inscritos en la actividad" : `${pct(value)}% del total`
            }
            icon={stat.icon}
            tone={stat.tone}
            progress={isTotal ? undefined : pct(value)}
            index={index}
          />
        );
      })}
    </div>
  );
}
