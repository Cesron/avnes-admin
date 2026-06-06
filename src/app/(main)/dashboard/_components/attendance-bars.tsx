import { cn } from "@/lib/cn";

type AttendanceBar = {
  dayLabel: string;
  percentage: number;
  hasData: boolean;
};

type AttendanceBarsProps = {
  data: AttendanceBar[];
};

export function AttendanceBars({ data }: AttendanceBarsProps) {
  return (
    <div className="flex h-32 items-end justify-between gap-2">
      {data.map((bar) => {
        // Map 0-100% to a visual height between 4% and 100% of the container
        const heightPct = bar.hasData
          ? Math.max(4, Math.min(100, bar.percentage))
          : 4;

        const colorClass = !bar.hasData
          ? "bg-muted"
          : bar.percentage >= 85
            ? "bg-emerald-500"
            : bar.percentage >= 70
              ? "bg-amber-500"
              : "bg-rose-500";

        return (
          <div
            key={bar.dayLabel}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="text-xs font-medium text-muted-foreground">
              {bar.hasData ? `${bar.percentage}%` : "—"}
            </div>
            <div className="relative flex h-full w-full items-end">
              <div
                className={cn("w-full rounded-t-md transition-all", colorClass)}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">{bar.dayLabel}</div>
          </div>
        );
      })}
    </div>
  );
}
