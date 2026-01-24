import { sql } from "@/lib/sql";
import type { AttendanceStatus } from "@/types/attendance";

type MarkAttendanceParams = {
  childId: string;
  occurrenceId: string;
  status: AttendanceStatus;
};

export async function markAttendance({
  childId,
  occurrenceId,
  status,
}: MarkAttendanceParams): Promise<{ id: string; status: AttendanceStatus }> {
  // Use UPSERT to either create or update the attendance
  const result = await sql.query<{ id: string; status: AttendanceStatus }>(
    `
    INSERT INTO attendances (child_id, activity_occurrence_id, status, marked_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (child_id, activity_occurrence_id)
    DO UPDATE SET status = $3, marked_at = NOW()
    RETURNING id, status
    `,
    [childId, occurrenceId, status],
  );

  return result.rows[0];
}
