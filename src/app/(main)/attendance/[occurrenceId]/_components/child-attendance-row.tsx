"use client";
import { CheckIcon, HelpCircleIcon, XIcon } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { AttendanceStatus, ChildAttendance } from "@/types/attendance";
import { calculateAge } from "@/utils/calculate-age";
import { markAttendanceAction } from "../../_lib/mark-attendance.action";

const options = [
  {
    status: "present",
    label: "Presente",
    icon: CheckIcon,
    selected:
      "bg-green-subtle text-green-subtle-foreground border-green-subtle-foreground hover:bg-green-subtle hover:text-green-subtle-foreground",
  },
  {
    status: "absent",
    label: "Ausente",
    icon: XIcon,
    selected:
      "bg-red-subtle text-red-subtle-foreground border-red-subtle-foreground hover:bg-red-subtle hover:text-red-subtle-foreground",
  },
  {
    status: "excused",
    label: "Permiso",
    icon: HelpCircleIcon,
    selected:
      "bg-amber-subtle text-amber-subtle-foreground border-amber-subtle-foreground hover:bg-amber-subtle hover:text-amber-subtle-foreground",
  },
] as const;
export function ChildAttendanceRow({
  child,
  occurrenceId,
  onStatusChange,
}: {
  child: ChildAttendance;
  occurrenceId: string;
  onStatusChange: (childId: string, status: AttendanceStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const nameId = useId();
  const messageId = useId();
  const handleStatusChange = (status: AttendanceStatus) => {
    if (isPending || status === child.attendance_status) return;
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await markAttendanceAction({
          childId: child.child_id,
          occurrenceId,
          status,
        });
        if (!result?.data || result.serverError || result.validationErrors) {
          setError(
            result?.serverError ||
              "No se pudo guardar. Intenta seleccionar la asistencia de nuevo.",
          );
          return;
        }
        onStatusChange(child.child_id, result.data.status);
        setSaved(true);
      } catch {
        setError(
          "No se pudo confirmar el guardado. Revisa tu conexión y vuelve a intentarlo.",
        );
      }
    });
  };
  return (
    <div className="space-y-3 border-b p-4 last:border-b-0">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 space-y-1">
          <p id={nameId} className="font-medium break-words">
            {child.child_name}
          </p>
          <p className="text-sm text-muted-foreground break-words">
            {calculateAge(child.child_birth_date)} años · {child.group_name}
          </p>
          <output id={messageId} className="text-sm text-muted-foreground">
            {isPending
              ? "Guardando…"
              : saved
                ? "Guardado"
                : child.attendance_status
                  ? `Registrado: ${options.find((option) => option.status === child.attendance_status)?.label}`
                  : "Sin registrar"}
          </output>
        </div>
        <fieldset
          aria-labelledby={nameId}
          aria-describedby={messageId}
          aria-busy={isPending}
          className="grid grid-cols-3 gap-2 lg:shrink-0"
        >
          {options.map(({ status, label, icon: Icon, selected }) => (
            <Button
              key={status}
              type="button"
              variant="outline"
              aria-pressed={child.attendance_status === status}
              className={cn(
                "min-h-11 px-2 shadow-none",
                child.attendance_status === status && selected,
              )}
              onClick={() => handleStatusChange(status)}
              disabled={isPending}
            >
              <Icon className="size-4 max-[360px]:hidden" aria-hidden="true" />
              {label}
            </Button>
          ))}
        </fieldset>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
