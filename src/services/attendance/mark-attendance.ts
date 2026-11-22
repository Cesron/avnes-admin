import type { SessionUserInfo } from "@/lib/auth-utils";
import { sql } from "@/lib/sql";
import type { AttendanceStatus } from "@/types/attendance";
import { CustomError } from "@/utils/custom-error";

type MarkAttendanceParams = {
  childId: string;
  occurrenceId: string;
  status: AttendanceStatus;
};

export async function markAttendance(
  { childId, occurrenceId, status }: MarkAttendanceParams,
  { role, userId }: Pick<SessionUserInfo, "role" | "userId">,
): Promise<{ id: string; status: AttendanceStatus }> {
  // Validate the session and active group membership in the write itself.
  // The scheduled date and time do not restrict when attendance is recorded.
  const result = await sql.query<{ id: string; status: AttendanceStatus }>(
    `
    INSERT INTO attendances (child_id, activity_occurrence_id, status, marked_at)
    SELECT $1::uuid, ao.id, $3, NOW()
    FROM activity_occurrences ao
    WHERE ao.id = $2 AND ao.status NOT IN ('cancelled', 'canceled')
      AND EXISTS (
        SELECT 1
        FROM activity_groups ag
        JOIN children_groups cg ON cg.group_id = ag.group_id
        JOIN groups g ON g.id = ag.group_id
        JOIN mentors m ON m.id = g.mentor_id
        WHERE ag.activity_id = ao.activity_id AND cg.child_id = $1
          AND cg.active = true AND (
            $4::text IN ('admin', 'coordinator') OR
            ($4::text = 'mentor' AND m.user_id = $5)
          )
      )
    ON CONFLICT (child_id, activity_occurrence_id)
    DO UPDATE SET status = $3, marked_at = NOW()
    RETURNING id, status
    `,
    [childId, occurrenceId, status, role, userId],
  );

  if (!result.rows[0]) {
    throw CustomError.forbidden(
      "No puedes registrar la asistencia de este niño en esta sesión.",
    );
  }

  return result.rows[0];
}
