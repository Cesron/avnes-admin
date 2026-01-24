"use server";

import { getActivityForEdit } from "@/services/activities/get-activity-for-edit";

export async function getActivityForEditAction(activityId: string) {
  return await getActivityForEdit(activityId);
}
