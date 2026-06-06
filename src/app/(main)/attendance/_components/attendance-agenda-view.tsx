"use client";

import type { WeekOccurrence } from "@/types/attendance";
import { formatDateLocal } from "@/utils/week-helpers";
import { OccurrenceCard } from "./occurrence-card";

interface AttendanceAgendaViewProps {
  calendarDays: Date[];
  occurrencesByDate: Map<string, WeekOccurrence[]>;
  todayStr: string;
}

const DAY_NAMES: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const MONTH_NAMES: Record<number, string> = {
  0: "ene",
  1: "feb",
  2: "mar",
  3: "abr",
  4: "may",
  5: "jun",
  6: "jul",
  7: "ago",
  8: "sep",
  9: "oct",
  10: "nov",
  11: "dic",
};

export function AttendanceAgendaView({
  calendarDays,
  occurrencesByDate,
  todayStr,
}: AttendanceAgendaViewProps) {
  return (
    <div className="space-y-3">
      {calendarDays.map((dayDate) => {
        const dateStr = formatDateLocal(dayDate);
        const dayOccurrences = occurrencesByDate.get(dateStr) || [];
        const dayNumber = dayDate.getDate();
        const dayName = DAY_NAMES[dayDate.getDay()];
        const monthName = MONTH_NAMES[dayDate.getMonth()];
        const isToday = dateStr === todayStr;

        return (
          <div
            key={dateStr}
            className={`rounded-lg border bg-card overflow-hidden ${
              isToday ? "border-primary ring-1 ring-primary/20" : ""
            }`}
          >
            {/* Day header */}
            <div
              className={`flex items-center gap-3 px-3 py-2 border-b ${
                isToday ? "bg-primary/5" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold ${
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground border"
                  }`}
                >
                  {dayNumber}
                </span>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-semibold leading-tight ${
                      isToday ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {dayName}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {monthName}
                  </span>
                </div>
              </div>

              {dayOccurrences.length > 0 && (
                <span className="ml-auto text-xs font-medium text-muted-foreground">
                  {dayOccurrences.length}{" "}
                  {dayOccurrences.length === 1 ? "actividad" : "actividades"}
                </span>
              )}

              {isToday && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  Hoy
                </span>
              )}
            </div>

            {/* Occurrences */}
            {dayOccurrences.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Sin actividades
              </p>
            ) : (
              <div className="p-2 space-y-2">
                {dayOccurrences.map((occ) => (
                  <OccurrenceCard
                    key={occ.occurrence_id}
                    occurrence={occ}
                    variant="agenda"
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
