"use server";

import { getChildren } from "@/services/children/get-children";

type GetChildrenActionParams = {
  clubId?: string;
  groupId?: string;
  search?: string;
  mentorGroupIds?: string[];
};

export async function getChildrenAction(params: GetChildrenActionParams) {
  return await getChildren(params);
}
