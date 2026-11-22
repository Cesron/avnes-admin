"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authorize } from "@/lib/auth-utils";
import { actionClient } from "@/lib/safe-action";
import { markAttendance } from "@/services/attendance/mark-attendance";
import type { UserRole } from "@/types/user";

const markAttendanceSchema = z.object({
  childId: z.string().uuid(),
  occurrenceId: z.string().uuid(),
  status: z.enum(["present", "absent", "excused"]),
});

export const markAttendanceAction = actionClient
  .inputSchema(markAttendanceSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await authorize("/attendance");
    const result = await markAttendance(parsedInput, {
      role: user.role as UserRole | null,
      userId: user.id,
    });

    revalidatePath(`/attendance/${parsedInput.occurrenceId}`);
    revalidatePath(`/children/${parsedInput.childId}/attendance`);
    revalidatePath("/groups/[groupId]", "page");

    return result;
  });
