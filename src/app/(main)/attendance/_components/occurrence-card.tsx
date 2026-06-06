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
  /** "agenda" uses a horizontal layout that fits wide cards (mobile / list view). */
  variant?: "default" | "agenda";
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

export function OccurrenceCard({
  occurrence,
  variant = "default",
}: OccurrenceCardProps) {
  const startTime = formatTime(occurrence.start_datetime);
  const endTime = formatTime(occurrence.end_datetime);
  const hasAttendance = occurrence.attendance_count > 0;

  if (variant === "agenda") {
    return (
      <Link
        href={`/attendance/${occurrence.occurrence_id}`}
        className="block rounded-md border bg-card p-3 transition-colors hover:bg-accent/50 active:bg-accent"
      >
        <div className="flex items-start gap-3">
          {/* Time column */}
          <div className="flex shrink-0 flex-col items-center justify-center rounded-md bg-muted/60 px-2 py-1.5 min-w-[58px]">
            <ClockIcon className="size-3 text-muted-foreground" />
            <span className="mt-0.5 text-xs font-semibold tabular-nums text-foreground">
              {startTime}
            </span>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {endTime}
            </span>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <h4 className="text-sm font-semibold leading-tight truncate">
              {occurrence.activity_name}
            </h4>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 min-w-0">
                <UsersIcon className="size-3 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  <GroupNamesDisplay groupNames={occurrence.group_names} />
                </span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className={`size-2 rounded-full shrink-0 ${getClubDotColor(occurrence.club_names)}`}
                />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  {occurrence.club_names}
                </span>
              </div>
            </div>

            {hasAttendance && (
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <ClipboardCheckIcon className="size-3" />
                <span>Asistencia ({occurrence.attendance_count})</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default (calendar grid) variant - keep compact
  return (
    <Link
      href={`/attendance/${occurrence.occurrence_id}`}
      className="block rounded-md border p-2 sm:p-2.5 transition-colors hover:bg-accent/50"
    >
      <div className="space-y-1">
        <h4 className="text-xs sm:text-sm font-semibold leading-tight line-clamp-2">
          {occurrence.activity_name}
        </h4>

        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
          <ClockIcon className="size-3 shrink-0" />
          <span className="tabular-nums truncate">
            {startTime} - {endTime}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground min-w-0">
          <UsersIcon className="size-3 shrink-0" />
          <span className="truncate min-w-0 flex-1">
            <GroupNamesDisplay groupNames={occurrence.group_names} />
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground min-w-0">
          <BlocksIcon className="size-3 shrink-0" />
          <span
            className={`size-2 rounded-full shrink-0 ${getClubDotColor(occurrence.club_names)}`}
          />
          <span className="truncate min-w-0 flex-1">
            {occurrence.club_names}
          </span>
        </div>

        {hasAttendance && (
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">
            <ClipboardCheckIcon className="size-3" />
            <span>Asist. ({occurrence.attendance_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
