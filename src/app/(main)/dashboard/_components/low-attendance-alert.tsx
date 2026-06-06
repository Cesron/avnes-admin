import { CircleAlertIcon, ShieldCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { LowAttendanceChild } from "@/services/dashboard/get-low-attendance-children";

type LowAttendanceAlertProps = {
  items: LowAttendanceChild[];
  className?: string;
};

function avatarColor(pct: number): string {
  if (pct >= 60) return "bg-amber-500/15 text-amber-700";
  return "bg-rose-500/15 text-rose-700";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LowAttendanceAlert({
  items,
  className,
}: LowAttendanceAlertProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CircleAlertIcon className="size-4 text-rose-500" />
          <CardTitle>Niños con baja asistencia</CardTitle>
        </div>
        <CardDescription>Por debajo del 70% en el mes en curso</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center text-sm text-muted-foreground">
            <ShieldCheckIcon className="size-8 text-emerald-500 opacity-70" />
            <p>¡Excelente! Todos los niños superan el 70%</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((child) => (
              <li key={child.child_id} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    avatarColor(child.percentage),
                  )}
                >
                  {getInitials(child.child_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {child.child_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {child.club_name} • {child.group_name}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge
                    variant="secondary"
                    className="bg-rose-500/15 text-rose-700 tabular-nums"
                  >
                    {child.percentage}%
                  </Badge>
                  <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                    {child.absent} ausencias
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
