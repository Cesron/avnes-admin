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
          variant={currentStatus === "present" ? "default" : "outline"}
          className={
            currentStatus === "present"
              ? "bg-green-600 hover:bg-green-700"
              : "hover:bg-green-100 hover:text-green-700 hover:border-green-300"
          }
          onClick={() => handleStatusChange("present")}
          disabled={isPending}
        >
          <CheckIcon className="size-4" />
          <span className="hidden sm:inline">Presente</span>
        </Button>

        <Button
          size="sm"
          variant={currentStatus === "absent" ? "default" : "outline"}
          className={
            currentStatus === "absent"
              ? "bg-red-600 hover:bg-red-700"
              : "hover:bg-red-100 hover:text-red-700 hover:border-red-300"
          }
          onClick={() => handleStatusChange("absent")}
          disabled={isPending}
        >
          <XIcon className="size-4" />
          <span className="hidden sm:inline">Ausente</span>
        </Button>

        <Button
          size="sm"
          variant={currentStatus === "excused" ? "default" : "outline"}
          className={
            currentStatus === "excused"
              ? "bg-amber-600 hover:bg-amber-700"
              : "hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300"
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
