"use client";

import type { TodayActivity } from "@/types/attendance";
import { CalendarIcon, InboxIcon } from "lucide-react";
import { ActivityCard } from "./activity-card";

interface TodayActivitiesListProps {
  activities: TodayActivity[];
  date: string;
  formattedDate: string;
}

export function TodayActivitiesList({
  activities,
  date,
  formattedDate,
}: TodayActivitiesListProps) {
  // Group activities by unique activity_id to avoid duplicates when an activity has multiple groups
  const uniqueActivities = activities.reduce(
    (acc, activity) => {
      if (!acc[activity.activity_id]) {
        acc[activity.activity_id] = activity;
      }
      return acc;
    },
    {} as Record<string, TodayActivity>,
  );

  const activityList = Object.values(uniqueActivities);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <CalendarIcon className="size-5" />
        <span>{formattedDate}</span>
      </div>

      {activityList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <InboxIcon className="size-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            No hay actividades para hoy
          </h3>
          <p className="text-sm text-muted-foreground/80 mt-1">
            No se encontraron actividades programadas para esta fecha con los
            filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {activityList.map((activity) => (
            <ActivityCard
              key={activity.activity_id}
              activity={activity}
              date={date}
            />
          ))}
        </div>
      )}
    </div>
  );
}
