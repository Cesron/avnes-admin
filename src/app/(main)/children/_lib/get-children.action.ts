"use server";

import { getSessionUserInfo } from "@/lib/auth-utils";
import { getChildren } from "@/services/children/get-children";

type GetChildrenActionParams = {
  clubId?: string;
  groupId?: string;
  search?: string;
};

export async function getChildrenAction(params: GetChildrenActionParams) {
  const user = await getSessionUserInfo("/children");
  return await getChildren({
    ...params,
    mentorGroupIds: user.role === "mentor" ? user.groupIds : undefined,
  });
}
