"use server";

import { revalidatePath } from "next/cache";
import { authorize } from "@/lib/auth-utils";
import { actionClient } from "@/lib/safe-action";
import { updateFamily } from "@/services/families/update-family";
import type { UserRole } from "@/types/user";
import { editFamilySchema } from "./edit-family.schema";

export const editFamilyAction = actionClient
  .inputSchema(editFamilySchema)
  .action(async ({ parsedInput }) => {
    const { user } = await authorize("/families");
    const family = await updateFamily(parsedInput, {
      userId: user.id,
      role: user.role as UserRole | null,
    });

    revalidatePath("/families");
    revalidatePath(`/families/${family.id}`);
    revalidatePath("/children");
    revalidatePath("/children/[childId]", "page");
    revalidatePath("/groups/[groupId]", "page");

    return { family };
  });
