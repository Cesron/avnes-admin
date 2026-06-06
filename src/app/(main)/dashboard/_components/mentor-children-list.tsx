import { UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { MentorChildRow } from "@/services/dashboard/get-mentor-children-with-attendance";

type MentorChildrenListProps = {
  items: MentorChildRow[];
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function attendanceColor(pct: number, hasData: boolean): string {
  if (!hasData) return "bg-muted text-muted-foreground";
  if (pct >= 85) return "bg-emerald-500/15 text-emerald-700";
  if (pct >= 70) return "bg-amber-500/15 text-amber-700";
  return "bg-rose-500/15 text-rose-700";
}

export function MentorChildrenList({ items }: MentorChildrenListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-5 pb-8 pt-2 text-center text-sm text-muted-foreground">
        <UsersIcon className="size-8 opacity-50" />
        <p>No tienes niños asignados</p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {items.map((child) => {
        const hasData = child.total > 0;
        return (
          <li
            key={child.child_id}
            className="flex items-center gap-3 px-5 py-3"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {getInitials(child.child_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{child.child_name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {child.group_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "tabular-nums font-medium",
                  attendanceColor(child.attendance_pct, hasData),
                )}
              >
                {hasData ? `${child.attendance_pct}%` : "Sin datos"}
              </Badge>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
