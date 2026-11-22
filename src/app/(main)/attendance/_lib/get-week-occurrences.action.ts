"use server";

import { getSessionUserInfo } from "@/lib/auth-utils";
import { getWeekOccurrences } from "@/services/attendance/get-week-occurrences";

type GetWeekOccurrencesParams = {
  startDate: string;
  endDate: string;
  clubId?: string;
  groupId?: string;
};

export async function getWeekOccurrencesAction(
  params: GetWeekOccurrencesParams,
) {
  const user = await getSessionUserInfo("/attendance");
  return getWeekOccurrences({
    ...params,
    mentorGroupIds: user.role === "mentor" ? user.groupIds : undefined,
  });
}
