"use server";

import { actionClient } from "@/lib/safe-action";
import { markAttendance } from "@/services/attendance/mark-attendance";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const markAttendanceSchema = z.object({
  childId: z.string().uuid(),
  occurrenceId: z.string().uuid(),
  status: z.enum(["present", "absent", "excused"]),
});

export const markAttendanceAction = actionClient
  .inputSchema(markAttendanceSchema)
  .action(async ({ parsedInput: { childId, occurrenceId, status } }) => {
    const result = await markAttendance({ childId, occurrenceId, status });

    revalidatePath(`/attendance/${occurrenceId}`);

    return result;
  });
