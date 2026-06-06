import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { GroupAttendance } from "@/services/dashboard/get-group-attendance-ranking";
import { getClubDotColor } from "@/utils/club-colors";

type GroupRankingProps = {
  groups: GroupAttendance[];
  icon: LucideIcon;
  title: string;
  emptyMessage: string;
};

export function GroupRanking({
  groups,
  icon: Icon,
  title,
  emptyMessage,
}: GroupRankingProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          Grupos con mayor porcentaje de asistencia del mes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <ol className="space-y-3">
            {groups.map((group, idx) => (
              <li key={group.group_id} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    idx === 0
                      ? "bg-amber-500/15 text-amber-700"
                      : idx === 1
                        ? "bg-zinc-400/15 text-zinc-600"
                        : idx === 2
                          ? "bg-orange-500/15 text-orange-700"
                          : "bg-muted text-muted-foreground",
                  )}
                >
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        getClubDotColor(group.club_name),
                      )}
                    />
                    <p className="truncate text-sm font-medium">
                      {group.group_name}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {group.club_name} • {group.present}/{group.total}
                  </p>
                </div>
                <Badge variant="secondary" className="tabular-nums">
                  {group.percentage}%
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
