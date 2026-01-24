"use client";

import { Button } from "@/components/ui/button";
import type { TodayActivity } from "@/types/attendance";
import { ClipboardCheckIcon, ClockIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createOccurrenceAction } from "../_lib/create-occurrence.action";

interface ActivityCardProps {
  activity: TodayActivity;
  date: string;
}

export function ActivityCard({ activity, date }: ActivityCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTakeAttendance = () => {
    startTransition(async () => {
      // If it's a non-recurring activity, occurrence already exists
      if (!activity.is_recurring && activity.occurrence_id) {
        router.push(`/attendance/${activity.occurrence_id}`);
        return;
      }

      // If it's recurring but already has occurrence for today
      if (activity.has_occurrence_today && activity.occurrence_id) {
        router.push(`/attendance/${activity.occurrence_id}`);
        return;
      }

      // Create occurrence for recurring activity
      const result = await createOccurrenceAction({
        activityId: activity.activity_id,
        date,
      });

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }

      if (result?.data?.occurrenceId) {
        router.push(`/attendance/${result.data.occurrenceId}`);
      }
    });
  };

  // Format time for display (remove seconds)
  const formatTime = (time: string) => {
    const parts = time.split(":");
    return `${parts[0]}:${parts[1]}`;
  };

  return (
    <div className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{activity.activity_name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <UsersIcon className="size-4" />
              <span>{activity.group_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="size-4" />
              <span>
                {formatTime(activity.start_time)} -{" "}
                {formatTime(activity.end_time)}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {activity.club_name}
          </div>
        </div>

        <Button
          onClick={handleTakeAttendance}
          disabled={isPending}
          className="shrink-0"
        >
          <ClipboardCheckIcon className="size-4" />
          {isPending
            ? "Cargando..."
            : activity.has_occurrence_today
              ? "Ver asistencia"
              : "Tomar asistencia"}
        </Button>
      </div>
    </div>
  );
}
