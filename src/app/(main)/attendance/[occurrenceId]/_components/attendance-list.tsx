"use client";

import type { AttendanceStatus, ChildAttendance } from "@/types/attendance";
import { InboxIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
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
  const unmarkedCount = children.filter(
    (c) => c.attendance_status === null,
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
      <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <UsersIcon className="size-5 text-muted-foreground" />
          <span className="font-medium">{totalChildren} niños</span>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">✓ {presentCount} presentes</span>
          <span className="text-red-600">✗ {absentCount} ausentes</span>
          <span className="text-amber-600">? {excusedCount} permisos</span>
          {unmarkedCount > 0 && (
            <span className="text-muted-foreground">
              • {unmarkedCount} sin marcar
            </span>
          )}
        </div>
      </div>

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
