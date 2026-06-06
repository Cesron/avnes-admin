"use client";

import { CalendarOffIcon } from "lucide-react";
import type { ActivityWithDetails } from "@/services/activities/get-activities";
import { ActivityCard } from "./activity-card";

interface ActivitiesCardsGridProps {
  activityList: ActivityWithDetails[];
}

export function ActivitiesCardsGrid({
  activityList,
}: ActivitiesCardsGridProps) {
  if (activityList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30">
        <CalendarOffIcon className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-medium text-muted-foreground">
          No hay actividades registradas
        </h3>
        <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
          Comienza agregando una nueva actividad usando el botón &ldquo;Agregar
          Actividad&rdquo; en la parte superior.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
      {activityList.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
