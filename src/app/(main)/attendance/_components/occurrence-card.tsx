"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WeekOccurrence } from "@/types/attendance";
import { getClubDotColor } from "@/utils/club-colors";
import {
  BlocksIcon,
  ClipboardCheckIcon,
  ClockIcon,
  UsersIcon,
} from "lucide-react";
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

function parseGroupNames(groupNames: string): string[] {
  return groupNames
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

function GroupNamesDisplay({ groupNames }: { groupNames: string }) {
  const groups = parseGroupNames(groupNames);

  if (groups.length === 0) {
    return <span className="truncate">—</span>;
  }

  if (groups.length === 1) {
    return <span className="truncate">{groups[0]}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default truncate">
          Varios grupos ({groups.length})
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="font-medium mb-1">Grupos:</p>
        <ul className="space-y-0.5">
          {groups.map((name) => (
            <li key={name} className="text-xs">
              • {name}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
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

        <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
          <UsersIcon className="size-3 shrink-0" />
          <GroupNamesDisplay groupNames={occurrence.group_names} />
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <BlocksIcon className="size-3" />
          <span
            className={`size-2 rounded-full shrink-0 ${getClubDotColor(occurrence.club_names)}`}
          />
          <span>{occurrence.club_names}</span>
        </div>

        {hasAttendance && (
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <ClipboardCheckIcon className="size-3" />
            <span>Asistencia ({occurrence.attendance_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
