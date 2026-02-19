"use server";

import { getWeekOccurrences } from "@/services/attendance/get-week-occurrences";

type GetWeekOccurrencesParams = {
  startDate: string;
  endDate: string;
  clubId?: string;
  groupId?: string;
  mentorGroupIds?: string[];
};

export async function getWeekOccurrencesAction(
  params: GetWeekOccurrencesParams,
) {
  return await getWeekOccurrences(params);
}
