import { BlocksIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ClubAttendance } from "@/services/dashboard/get-club-attendance";
import { getClubDotColor } from "@/utils/club-colors";

type ClubAttendanceListProps = {
  clubs: ClubAttendance[];
};

function barColor(pct: number, hasData: boolean): string {
  if (!hasData) return "bg-muted";
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-rose-500";
}

export function ClubAttendanceList({ clubs }: ClubAttendanceListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Asistencia por club</CardTitle>
        <CardDescription>
          Porcentaje de asistencia del mes en curso
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clubs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos</p>
        ) : (
          <ul className="space-y-4">
            {clubs.map((club) => {
              const hasData = club.total > 0;
              return (
                <li key={club.club_id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2 truncate">
                      <BlocksIcon className="size-4 text-muted-foreground" />
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          getClubDotColor(club.club_name),
                        )}
                      />
                      <span className="truncate font-medium">
                        {club.club_name}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                      {hasData
                        ? `${club.present}/${club.total} • ${club.percentage}%`
                        : "Sin datos"}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        barColor(club.percentage, hasData),
                      )}
                      style={{
                        width: hasData
                          ? `${Math.max(2, club.percentage)}%`
                          : "0%",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
