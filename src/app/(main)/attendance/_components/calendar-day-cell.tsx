"use client";

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
      className={`min-h-[120px] rounded-lg border p-2 transition-colors ${
        !isCurrentMonth
          ? "bg-muted/30 opacity-50"
          : isToday
            ? "border-primary bg-primary/5"
            : "bg-card"
      }`}
    >
      <div className="mb-1 flex items-center gap-1">
        <span
          className={`inline-flex size-7 items-center justify-center rounded-full text-sm font-medium ${
            isToday
              ? "bg-primary text-primary-foreground"
              : isCurrentMonth
                ? "text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {dayNumber}
        </span>
        {isToday && (
          <span className="text-xs font-medium text-primary">Hoy</span>
        )}
      </div>

      {occurrences.length === 0 ? (
        isCurrentMonth ? (
          <p className="py-2 text-center text-[10px] text-muted-foreground/60">
            —
          </p>
        ) : null
      ) : (
        <div className="space-y-1">
          {occurrences.map((occ) => (
            <OccurrenceCard key={occ.occurrence_id} occurrence={occ} />
          ))}
        </div>
      )}
    </div>
  );
}
