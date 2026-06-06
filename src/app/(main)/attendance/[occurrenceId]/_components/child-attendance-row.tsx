"use client";

import { Button } from "@/components/ui/button";
import type { AttendanceStatus, ChildAttendance } from "@/types/attendance";
import { calculateAge } from "@/utils/calculate-age";
import { CheckIcon, HelpCircleIcon, XIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { markAttendanceAction } from "../../_lib/mark-attendance.action";

interface ChildAttendanceRowProps {
  child: ChildAttendance;
  occurrenceId: string;
  onStatusChange: (childId: string, status: AttendanceStatus) => void;
}

export function ChildAttendanceRow({
  child,
  occurrenceId,
  onStatusChange,
}: ChildAttendanceRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: AttendanceStatus) => {
    startTransition(async () => {
      const result = await markAttendanceAction({
        childId: child.child_id,
        occurrenceId,
        status,
      });

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }

      onStatusChange(child.child_id, status);

      const statusLabels: Record<AttendanceStatus, string> = {
        present: "Presente",
        absent: "Ausente",
        excused: "Con permiso",
      };

      toast.success(`${child.child_name} marcado como ${statusLabels[status]}`);
    });
  };

  const age = calculateAge(child.child_birth_date);
  const currentStatus = child.attendance_status;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-card">
      <div className="space-y-1">
        <div className="font-medium">{child.child_name}</div>
        <div className="text-sm text-muted-foreground">
          {age} años • {child.group_name}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className={
            currentStatus === "present"
              ? "bg-green-subtle text-green-subtle-foreground border-green-subtle"
              : undefined
          }
          onClick={() => handleStatusChange("present")}
          disabled={isPending}
        >
          <CheckIcon className="size-4" />
          <span className="hidden sm:inline">Presente</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className={
            currentStatus === "absent"
              ? "bg-red-subtle text-red-subtle-foreground border-red-subtle"
              : undefined
          }
          onClick={() => handleStatusChange("absent")}
          disabled={isPending}
        >
          <XIcon className="size-4" />
          <span className="hidden sm:inline">Ausente</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className={
            currentStatus === "excused"
              ? "bg-amber-subtle text-amber-subtle-foreground border-amber-subtle"
              : undefined
          }
          onClick={() => handleStatusChange("excused")}
          disabled={isPending}
        >
          <HelpCircleIcon className="size-4" />
          <span className="hidden sm:inline">Permiso</span>
        </Button>
      </div>
    </div>
  );
}
