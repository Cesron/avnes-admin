"use server";

import { authorize, getSessionUserInfo } from "@/lib/auth-utils";
import { getChildren } from "@/services/children/get-children";

type GetChildrenActionParams = {
  clubId?: string;
  groupId?: string;
  search?: string;
};

export async function getChildrenAction(params: GetChildrenActionParams) {
  await authorize("/children");
  const user = await getSessionUserInfo();
  return await getChildren({
    ...params,
    mentorGroupIds: user.role === "mentor" ? user.groupIds : undefined,
  });
}
