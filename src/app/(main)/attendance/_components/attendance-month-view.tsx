"use client";

import type { GroupOption } from "@/services/groups/get-groups-options";
import type { WeekOccurrence } from "@/types/attendance";
import {
  formatDateLocal,
  getCalendarDays,
  getMonthEnd,
  getMonthStart,
} from "@/utils/week-helpers";
import { useCallback, useState, useTransition } from "react";
import { getMonthOccurrencesAction } from "../_lib/get-month-occurrences.action";
import { AttendanceFilters } from "./attendance-filters";
import { CalendarDayCell } from "./calendar-day-cell";
import { MonthNavigator } from "./month-navigator";

type ClubOption = {
  id: string;
  name: string;
};

const WEEKDAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface AttendanceMonthViewProps {
  initialOccurrences: WeekOccurrence[];
  initialMonthStart: string;
  clubs: ClubOption[];
  groups: GroupOption[];
  mentorGroupIds?: string[];
}

export function AttendanceMonthView({
  initialOccurrences,
  initialMonthStart,
  clubs,
  groups,
  mentorGroupIds,
}: AttendanceMonthViewProps) {
  const [occurrences, setOccurrences] =
    useState<WeekOccurrence[]>(initialOccurrences);
  const [currentMonthStart, setCurrentMonthStart] = useState(initialMonthStart);
  const [selectedClubId, setSelectedClubId] = useState("all");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [isPending, startTransition] = useTransition();

  const [year, month] = currentMonthStart.split("-").map(Number);
  const monthStartDate = new Date(year, month - 1, 1);
  const calendarDays = getCalendarDays(monthStartDate);

  const fetchOccurrences = useCallback(
    (monthStart: string, clubId: string, groupId: string) => {
      const [y, m] = monthStart.split("-").map(Number);
      const start = getMonthStart(new Date(y, m - 1, 1));
      const end = getMonthEnd(new Date(y, m - 1, 1));

      startTransition(async () => {
        const result = await getMonthOccurrencesAction({
          startDate: formatDateLocal(start),
          endDate: formatDateLocal(end),
          clubId: clubId === "all" ? undefined : clubId,
          groupId: groupId === "all" ? undefined : groupId,
          mentorGroupIds,
        });
        setOccurrences(result);
      });
    },
    [mentorGroupIds],
  );

  const handleMonthChange = (newMonthStart: string) => {
    setCurrentMonthStart(newMonthStart);
    fetchOccurrences(newMonthStart, selectedClubId, selectedGroupId);
  };

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedGroupId("all");
    fetchOccurrences(currentMonthStart, clubId, "all");
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    fetchOccurrences(currentMonthStart, selectedClubId, groupId);
  };

  const occurrencesByDate = new Map<string, WeekOccurrence[]>();
  for (const occ of occurrences) {
    const dateKey = occ.start_datetime.split(" ")[0];
    const existing = occurrencesByDate.get(dateKey) || [];
    existing.push(occ);
    occurrencesByDate.set(dateKey, existing);
  }

  const todayStr = formatDateLocal(new Date());
  const currentMonth = monthStartDate.getMonth();

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

      <MonthNavigator
        currentMonthStart={currentMonthStart}
        onMonthChange={handleMonthChange}
      />

      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_HEADERS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayDate) => {
              const dateStr = formatDateLocal(dayDate);
              const dayOccurrences = occurrencesByDate.get(dateStr) || [];

              return (
                <CalendarDayCell
                  key={dateStr}
                  date={dayDate}
                  occurrences={dayOccurrences}
                  isToday={dateStr === todayStr}
                  isCurrentMonth={dayDate.getMonth() === currentMonth}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
