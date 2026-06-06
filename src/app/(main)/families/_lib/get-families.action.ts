"use server";

import { getFamilies } from "@/services/families/get-families";

type GetFamiliesActionParams = {
  search?: string;
};

export async function getFamiliesAction(params: GetFamiliesActionParams) {
  return await getFamilies(params);
}
