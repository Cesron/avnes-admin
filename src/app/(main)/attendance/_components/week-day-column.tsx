"use client";

import type { WeekOccurrence } from "@/types/attendance";
import { OccurrenceCard } from "./occurrence-card";

interface WeekDayColumnProps {
  date: Date;
  occurrences: WeekOccurrence[];
  isToday: boolean;
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

export function WeekDayColumn({
  date,
  occurrences,
  isToday,
}: WeekDayColumnProps) {
  const dayName = DAY_NAMES[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString("es-ES", { month: "short" });

  return (
    <div
      className={`rounded-lg border p-3 ${isToday ? "border-primary bg-primary/5" : "bg-card"}`}
    >
      <div className="mb-3 flex items-baseline gap-2">
        <span
          className={`text-2xl font-bold ${isToday ? "text-primary" : "text-foreground"}`}
        >
          {dayNumber}
        </span>
        <div className="flex flex-col">
          <span
            className={`text-sm font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}
          >
            {dayName}
          </span>
          <span className="text-xs text-muted-foreground">{monthName}</span>
        </div>
        {isToday && (
          <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            Hoy
          </span>
        )}
      </div>

      {occurrences.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          Sin actividades
        </p>
      ) : (
        <div className="space-y-2">
          {occurrences.map((occ) => (
            <OccurrenceCard key={occ.occurrence_id} occurrence={occ} />
          ))}
        </div>
      )}
    </div>
  );
}
