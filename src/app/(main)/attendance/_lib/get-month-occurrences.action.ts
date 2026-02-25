"use server";

import { getWeekOccurrences } from "@/services/attendance/get-week-occurrences";

type GetMonthOccurrencesParams = {
  startDate: string;
  endDate: string;
  clubId?: string;
  groupId?: string;
  mentorGroupIds?: string[];
};

export async function getMonthOccurrencesAction(
  params: GetMonthOccurrencesParams,
) {
  return await getWeekOccurrences(params);
}
