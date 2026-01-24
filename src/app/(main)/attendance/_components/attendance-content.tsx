"use client";

import type { GroupOption } from "@/services/groups/get-groups-options";
import type { TodayActivity } from "@/types/attendance";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getTodayActivitiesAction } from "../_lib/get-today-activities.action";
import { AttendanceFilters } from "./attendance-filters";
import { TodayActivitiesList } from "./today-activities-list";

type ClubOption = {
  id: string;
  name: string;
};

interface AttendanceContentProps {
  initialActivities: TodayActivity[];
  clubs: ClubOption[];
  groups: GroupOption[];
}

export function AttendanceContent({
  initialActivities,
  clubs,
  groups,
}: AttendanceContentProps) {
  const [activities, setActivities] =
    useState<TodayActivity[]>(initialActivities);
  const [selectedClubId, setSelectedClubId] = useState("all");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Get today's date info
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];

  // Format date for display in Spanish
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Capitalize first letter
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const fetchActivities = useCallback(
    (clubId: string, groupId: string) => {
      startTransition(async () => {
        const result = await getTodayActivitiesAction({
          clubId: clubId === "all" ? undefined : clubId,
          groupId: groupId === "all" ? undefined : groupId,
          date: dateString,
        });
        setActivities(result);
      });
    },
    [dateString],
  );

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedGroupId("all"); // Reset group when club changes
    fetchActivities(clubId, "all");
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    fetchActivities(selectedClubId, groupId);
  };

  // Initial fetch on mount
  useEffect(() => {
    // Activities are already loaded from server
  }, []);

  return (
    <div className="space-y-6">
      <AttendanceFilters
        clubs={clubs}
        groups={groups}
        selectedClubId={selectedClubId}
        selectedGroupId={selectedGroupId}
        onClubChange={handleClubChange}
        onGroupChange={handleGroupChange}
      />

      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <TodayActivitiesList
          activities={activities}
          date={dateString}
          formattedDate={capitalizedDate}
        />
      )}
    </div>
  );
}
