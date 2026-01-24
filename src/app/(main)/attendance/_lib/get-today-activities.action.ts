"use server";

import { getTodayActivities } from "@/services/attendance/get-today-activities";

type GetTodayActivitiesParams = {
  clubId?: string;
  groupId?: string;
  date?: string;
};

export async function getTodayActivitiesAction(
  params: GetTodayActivitiesParams = {},
) {
  return await getTodayActivities(params);
}
