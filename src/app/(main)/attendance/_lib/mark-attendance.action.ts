"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUserInfo } from "@/lib/auth-utils";
import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { markAttendance } from "@/services/attendance/mark-attendance";
import { CustomError } from "@/utils/custom-error";

const markAttendanceSchema = z.object({
  childId: z.string().uuid(),
  occurrenceId: z.string().uuid(),
  status: z.enum(["present", "absent", "excused"]),
});

export const markAttendanceAction = actionClient
  .inputSchema(markAttendanceSchema)
  .action(async ({ parsedInput: { childId, occurrenceId, status } }) => {
    const userInfo = await getSessionUserInfo();

    // Defense in depth: even if the UI is bypassed (e.g. a mentor calls this
    // action directly with a childId from another group), we must verify that
    // the child is part of one of the mentor's groups before persisting.
    if (userInfo.role === "mentor") {
      if (userInfo.groupIds.length === 0) {
        throw CustomError.forbidden(
          "No tienes grupos asignados para tomar asistencia.",
        );
      }

      const ownershipResult = await sql.query<{ exists: boolean }>(
        `SELECT EXISTS (
           SELECT 1
           FROM children_groups cg
           WHERE cg.child_id = $1
             AND cg.active = true
             AND cg.group_id = ANY($2::uuid[])
         ) as exists`,
        [childId, userInfo.groupIds],
      );

      if (!ownershipResult.rows[0]?.exists) {
        throw CustomError.forbidden(
          "No tienes permisos para registrar la asistencia de este niño.",
        );
      }
    }

    const result = await markAttendance({ childId, occurrenceId, status });

    revalidatePath(`/attendance/${occurrenceId}`);

    return result;
  });
