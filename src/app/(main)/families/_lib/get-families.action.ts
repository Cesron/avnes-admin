"use server";

import { authorize } from "@/lib/auth-utils";
import { getFamilies } from "@/services/families/get-families";

type GetFamiliesActionParams = {
  search?: string;
};

export async function getFamiliesAction(params: GetFamiliesActionParams) {
  await authorize("/families");
  return await getFamilies(params);
}
