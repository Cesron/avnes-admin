"use client";

import { cn } from "@/lib/cn";
import type { WeekOccurrence } from "@/types/attendance";
import { OccurrenceCard } from "./occurrence-card";

interface CalendarDayCellProps {
  date: Date;
  occurrences: WeekOccurrence[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export function CalendarDayCell({
  date,
  occurrences,
  isToday,
  isCurrentMonth,
}: CalendarDayCellProps) {
  const dayNumber = date.getDate();

  return (
    <div
      className={cn(
        "min-h-[88px] sm:min-h-[120px] rounded-md sm:rounded-lg border p-1 sm:p-2 transition-colors overflow-hidden",
        !isCurrentMonth
          ? "bg-muted/30 opacity-50"
          : isToday
            ? "border-primary bg-primary/5"
            : "bg-card",
      )}
    >
      <div className="mb-0.5 sm:mb-1 flex items-center gap-1">
        <span
          className={cn(
            "inline-flex size-5 sm:size-7 items-center justify-center rounded-full text-[10px] sm:text-sm font-medium tabular-nums",
            isToday
              ? "bg-primary text-primary-foreground"
              : isCurrentMonth
                ? "text-foreground"
                : "text-muted-foreground",
          )}
        >
          {dayNumber}
        </span>
        {isToday && (
          <span className="text-[9px] sm:text-xs font-medium text-primary leading-none">
            Hoy
          </span>
        )}
      </div>

      {occurrences.length === 0 ? (
        isCurrentMonth ? (
          <p className="hidden sm:block py-2 text-center text-[10px] text-muted-foreground/60">
            —
          </p>
        ) : null
      ) : (
        <div className="space-y-1">
          {occurrences.slice(0, 2).map((occ) => (
            <OccurrenceCard
              key={occ.occurrence_id}
              occurrence={occ}
              variant="default"
            />
          ))}
          {occurrences.length > 2 && (
            <details className="space-y-1">
              <summary className="cursor-pointer rounded-sm bg-muted/60 px-1 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground sm:py-1 sm:text-xs">
                +{occurrences.length - 2} más
              </summary>
              {occurrences.slice(2).map((occ) => (
                <OccurrenceCard key={occ.occurrence_id} occurrence={occ} />
              ))}
            </details>
          )}
        </div>
      )}
    </div>
  );
}
