import { CalendarOffIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { getTodayActivities } from "@/services/attendance/get-today-activities";
import { getClubDotColor } from "@/utils/club-colors";

type TodayActivitiesCardProps = {
  /** Empty array = show activities for all groups (admin/coordinator) */
  groupIds: string[];
  /** If set, filters by club. Admin/coordinator can pass undefined to show all. */
  clubId?: string;
  /** Show club & group columns (admin) or hide them (mentor) */
  showClubs?: boolean;
  /** Extra classes passed to the root Card (e.g. grid column spans) */
  className?: string;
};

function formatTime(time: string): string {
  // time is "HH:MM:SS" or "HH:MM"
  const parts = time.split(":");
  if (parts.length < 2) return time;
  return `${parts[0]}:${parts[1]}`;
}

export async function TodayActivitiesCard({
  groupIds,
  clubId,
  showClubs = true,
  className,
}: TodayActivitiesCardProps) {
  const activities = await getTodayActivities({
    clubId,
    groupId: undefined,
  });

  // Mentor: filter to only their groups
  const filtered =
    groupIds.length > 0
      ? activities.filter((a) => groupIds.includes(a.group_id))
      : activities;

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Hoy</CardTitle>
        <CardDescription>
          Actividades programadas para el día de hoy
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <CalendarOffIcon className="size-8 opacity-50" />
            <p>No hay actividades programadas para hoy</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((activity, idx) => (
              <li key={`${activity.activity_id}-${activity.group_id}-${idx}`}>
                {idx > 0 && <Separator className="my-2" />}
                <Link
                  href={
                    activity.occurrence_id
                      ? `/attendance/${activity.occurrence_id}`
                      : "/attendance"
                  }
                  className="-mx-2 flex items-start gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <ClockIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">
                        {activity.activity_name}
                      </p>
                      <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                        {formatTime(activity.start_time)} -{" "}
                        {formatTime(activity.end_time)}
                      </span>
                    </div>
                    {showClubs && (
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span
                            className={`size-2 rounded-full ${getClubDotColor(activity.club_name)}`}
                          />
                          {activity.club_name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="size-3" />
                          {activity.group_name}
                        </span>
                      </div>
                    )}
                    {!showClubs && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {activity.group_name}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
