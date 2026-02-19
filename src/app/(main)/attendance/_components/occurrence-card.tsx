"use client";

import type { WeekOccurrence } from "@/types/attendance";
import { ClipboardCheckIcon, ClockIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

interface OccurrenceCardProps {
  occurrence: WeekOccurrence;
}

function formatTime(datetime: string): string {
  // datetime is "YYYY-MM-DD HH:MM:SS"
  const timePart = datetime.split(" ")[1];
  if (!timePart) return "";
  const parts = timePart.split(":");
  return `${parts[0]}:${parts[1]}`;
}

export function OccurrenceCard({ occurrence }: OccurrenceCardProps) {
  const startTime = formatTime(occurrence.start_datetime);
  const endTime = formatTime(occurrence.end_datetime);
  const hasAttendance = occurrence.attendance_count > 0;

  return (
    <Link
      href={`/attendance/${occurrence.occurrence_id}`}
      className="block rounded-md border p-3 transition-colors hover:bg-accent/50"
    >
      <div className="space-y-1.5">
        <h4 className="text-sm font-semibold leading-tight">
          {occurrence.activity_name}
        </h4>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ClockIcon className="size-3" />
          <span>
            {startTime} - {endTime}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <UsersIcon className="size-3" />
          <span>{occurrence.group_names}</span>
        </div>

        <div className="text-xs text-muted-foreground">
          {occurrence.club_names}
        </div>

        {hasAttendance && (
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <ClipboardCheckIcon className="size-3" />
            <span>Asistencia registrada ({occurrence.attendance_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
