"use client";

import { InboxIcon } from "lucide-react";
import { useState } from "react";
import type { AttendanceStatus, ChildAttendance } from "@/types/attendance";
import { AttendanceStatsCards } from "./attendance-stats-cards";
import { ChildAttendanceRow } from "./child-attendance-row";

interface AttendanceListProps {
  initialChildren: ChildAttendance[];
  occurrenceId: string;
}

export function AttendanceList({
  initialChildren,
  occurrenceId,
}: AttendanceListProps) {
  const [children, setChildren] = useState(initialChildren);

  const handleStatusChange = (childId: string, status: AttendanceStatus) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.child_id === childId
          ? { ...child, attendance_status: status }
          : child,
      ),
    );
  };

  // Calculate stats
  const totalChildren = children.length;
  const presentCount = children.filter(
    (c) => c.attendance_status === "present",
  ).length;
  const absentCount = children.filter(
    (c) => c.attendance_status === "absent",
  ).length;
  const excusedCount = children.filter(
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
      {/* Stats */}
      <AttendanceStatsCards
        total={totalChildren}
        present={presentCount}
        absent={absentCount}
        excused={excusedCount}
      />

      {/* Children list */}
      <div className="space-y-3">
        {children.map((child) => (
          <ChildAttendanceRow
            key={child.child_id}
            child={child}
            occurrenceId={occurrenceId}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
