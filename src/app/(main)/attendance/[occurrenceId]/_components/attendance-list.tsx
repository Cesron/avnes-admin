"use client";

import { InboxIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { AttendanceStatus, ChildAttendance } from "@/types/attendance";
import { AttendanceFilters } from "../../_components/attendance-filters";
import { AttendanceStatsCards } from "./attendance-stats-cards";
import { ChildAttendanceRow } from "./child-attendance-row";

type ClubOption = {
  id: string;
  name: string;
};

type GroupOption = {
  id: string;
  name: string;
  club_name: string;
};

interface AttendanceListProps {
  initialChildren: ChildAttendance[];
  occurrenceId: string;
  /** Groups that belong to this activity (and are visible to the current user). */
  groups: GroupOption[];
  /** Unique clubs derived from the activity's groups. */
  clubs: ClubOption[];
}

export function AttendanceList({
  initialChildren,
  occurrenceId,
  groups,
  clubs,
}: AttendanceListProps) {
  const [children, setChildren] = useState(initialChildren);
  const [selectedClubId, setSelectedClubId] = useState<string>(
    clubs.length === 1 ? clubs[0].id : "all",
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    groups.length === 1 ? groups[0].id : "all",
  );

  const handleStatusChange = (childId: string, status: AttendanceStatus) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.child_id === childId
          ? { ...child, attendance_status: status }
          : child,
      ),
    );
  };

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedGroupId("all");
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  // Filter UI is only useful when there is more than one club AND more than
  // one group to choose between. With a single option on either side the
  // value is auto-applied (already in the default state) and the dropdowns
  // are hidden.
  const showFilters = clubs.length > 1 && groups.length > 1;

  const visibleChildren = useMemo(() => {
    return children.filter((child) => {
      if (selectedClubId !== "all" && child.club_id !== selectedClubId) {
        return false;
      }
      if (selectedGroupId !== "all" && child.group_id !== selectedGroupId) {
        return false;
      }
      return true;
    });
  }, [children, selectedClubId, selectedGroupId]);

  // Calculate stats from the visible (filtered) children
  const totalChildren = visibleChildren.length;
  const presentCount = visibleChildren.filter(
    (c) => c.attendance_status === "present",
  ).length;
  const absentCount = visibleChildren.filter(
    (c) => c.attendance_status === "absent",
  ).length;
  const excusedCount = visibleChildren.filter(
    (c) => c.attendance_status === "excused",
  ).length;

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <InboxIcon className="size-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No hay niños registrados
        </h3>
        <p className="text-sm text-muted-foreground/80 mt-1">
          No se encontraron niños en los grupos de esta actividad.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <AttendanceFilters
          clubs={clubs}
          groups={groups}
          selectedClubId={selectedClubId}
          selectedGroupId={selectedGroupId}
          onClubChange={handleClubChange}
          onGroupChange={handleGroupChange}
        />
      )}

      {/* Stats */}
      <AttendanceStatsCards
        total={totalChildren}
        present={presentCount}
        absent={absentCount}
        excused={excusedCount}
      />

      {/* Children list */}
      {visibleChildren.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg">
          <p className="text-sm text-muted-foreground">
            No hay niños que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleChildren.map((child) => (
            <ChildAttendanceRow
              key={child.child_id}
              child={child}
              occurrenceId={occurrenceId}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
