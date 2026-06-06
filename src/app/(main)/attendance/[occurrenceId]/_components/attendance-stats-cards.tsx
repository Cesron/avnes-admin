import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck2Icon,
  CalendarX2Icon,
  ClockAlertIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface AttendanceStatsCardsProps {
  total: number;
  present: number;
  absent: number;
  excused: number;
}

type StatTone = "blue" | "green" | "red" | "amber";

const TONE_STYLES: Record<StatTone, { icon: string; bg: string }> = {
  blue: {
    icon: "text-blue-subtle-foreground",
    bg: "bg-blue-subtle",
  },
  green: {
    icon: "text-green-subtle-foreground",
    bg: "bg-green-subtle",
  },
  red: {
    icon: "text-red-subtle-foreground",
    bg: "bg-red-subtle",
  },
  amber: {
    icon: "text-amber-subtle-foreground",
    bg: "bg-amber-subtle",
  },
};

interface StatCardData {
  key: string;
  label: string;
  value: number;
  tone: StatTone;
  icon: LucideIcon;
}

export function AttendanceStatsCards({
  total,
  present,
  absent,
  excused,
}: AttendanceStatsCardsProps) {
  const safeTotal = total > 0 ? total : 1;
  const percentageOf = (value: number) => Math.round((value / safeTotal) * 100);

  const stats: StatCardData[] = [
    {
      key: "total",
      label: "Total de niños",
      value: total,
      tone: "blue",
      icon: UsersIcon,
    },
    {
      key: "present",
      label: "Presentes",
      value: present,
      tone: "green",
      icon: CalendarCheck2Icon,
    },
    {
      key: "absent",
      label: "Ausentes",
      value: absent,
      tone: "red",
      icon: CalendarX2Icon,
    },
    {
      key: "excused",
      label: "Permisos",
      value: excused,
      tone: "amber",
      icon: ClockAlertIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => {
        const tone = TONE_STYLES[stat.tone];
        const Icon = stat.icon;
        const percentage =
          stat.key === "total" ? 100 : percentageOf(stat.value);

        return (
          <Card key={stat.key} className="py-4">
            <CardHeader className="px-4">
              <CardDescription className="font-medium text-xs uppercase tracking-wide">
                {stat.label}
              </CardDescription>
              <CardAction>
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full",
                    tone.bg,
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("size-4", tone.icon)} />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="px-4 space-y-0.5">
              <CardTitle className="text-3xl font-bold tabular-nums">
                {stat.value}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {percentage}% del total
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
