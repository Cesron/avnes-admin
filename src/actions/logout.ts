"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { headers } from "next/headers";

export const logoutAction = actionClient.action(async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
});
