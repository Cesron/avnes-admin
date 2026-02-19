"use client";

import type { GroupOption } from "@/services/groups/get-groups-options";
import type { WeekOccurrence } from "@/types/attendance";
import {
  formatDateLocal,
  getWeekDays,
  getWeekMonday,
  getWeekSunday,
} from "@/utils/week-helpers";
import { useCallback, useState, useTransition } from "react";
import { getWeekOccurrencesAction } from "../_lib/get-week-occurrences.action";
import { AttendanceFilters } from "./attendance-filters";
import { WeekNavigator } from "./week-navigator";
import { WeekDayColumn } from "./week-day-column";

type ClubOption = {
  id: string;
  name: string;
};

interface AttendanceWeekViewProps {
  initialOccurrences: WeekOccurrence[];
  initialWeekStart: string; // YYYY-MM-DD (Monday)
  clubs: ClubOption[];
  groups: GroupOption[];
  /** When set, restricts data to these group IDs (for mentor role) */
  mentorGroupIds?: string[];
}

export function AttendanceWeekView({
  initialOccurrences,
  initialWeekStart,
  clubs,
  groups,
  mentorGroupIds,
}: AttendanceWeekViewProps) {
  const [occurrences, setOccurrences] =
    useState<WeekOccurrence[]>(initialOccurrences);
  const [currentWeekStart, setCurrentWeekStart] = useState(initialWeekStart);
  const [selectedClubId, setSelectedClubId] = useState("all");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Parse current week start to get all week days
  const [year, month, day] = currentWeekStart.split("-").map(Number);
  const weekStartDate = new Date(year, month - 1, day);
  const weekDays = getWeekDays(weekStartDate);

  const fetchOccurrences = useCallback(
    (weekStart: string, clubId: string, groupId: string) => {
      const [y, m, d] = weekStart.split("-").map(Number);
      const monday = new Date(y, m - 1, d);
      const sunday = getWeekSunday(monday);
      const weekEnd = formatDateLocal(sunday);

      startTransition(async () => {
        const result = await getWeekOccurrencesAction({
          startDate: weekStart,
          endDate: weekEnd,
          clubId: clubId === "all" ? undefined : clubId,
          groupId: groupId === "all" ? undefined : groupId,
          mentorGroupIds,
        });
        setOccurrences(result);
      });
    },
    [mentorGroupIds],
  );

  const handleWeekChange = (newWeekStart: string) => {
    setCurrentWeekStart(newWeekStart);
    fetchOccurrences(newWeekStart, selectedClubId, selectedGroupId);
  };

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedGroupId("all");
    fetchOccurrences(currentWeekStart, clubId, "all");
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    fetchOccurrences(currentWeekStart, selectedClubId, groupId);
  };

  // Group occurrences by date
  const occurrencesByDate = new Map<string, WeekOccurrence[]>();
  for (const occ of occurrences) {
    // start_datetime is "YYYY-MM-DD HH:MM:SS"
    const dateKey = occ.start_datetime.split(" ")[0];
    const existing = occurrencesByDate.get(dateKey) || [];
    existing.push(occ);
    occurrencesByDate.set(dateKey, existing);
  }

  const todayStr = formatDateLocal(new Date());

  return (
    <div className="space-y-6">
      <AttendanceFilters
        clubs={clubs}
        groups={groups}
        selectedClubId={selectedClubId}
        selectedGroupId={selectedGroupId}
        onClubChange={handleClubChange}
        onGroupChange={handleGroupChange}
      />

      <WeekNavigator
        currentWeekStart={currentWeekStart}
        onWeekChange={handleWeekChange}
      />

      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {weekDays.map((dayDate) => {
            const dateStr = formatDateLocal(dayDate);
            const dayOccurrences = occurrencesByDate.get(dateStr) || [];

            return (
              <WeekDayColumn
                key={dateStr}
                date={dayDate}
                occurrences={dayOccurrences}
                isToday={dateStr === todayStr}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
