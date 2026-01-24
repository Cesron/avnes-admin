import { sql } from "@/lib/sql";
import type { AttendanceStatus, ChildAttendance } from "@/types/attendance";

export async function getChildrenForAttendance(
  occurrenceId: string,
): Promise<ChildAttendance[]> {
  // First, get the activity_id from the occurrence
  const occurrenceResult = await sql.query<{ activity_id: string }>(
    `SELECT activity_id FROM activity_occurrences WHERE id = $1`,
    [occurrenceId],
  );

  if (occurrenceResult.rows.length === 0) {
    return [];
  }

  const activityId = occurrenceResult.rows[0].activity_id;

  // Get all children that belong to the groups of this activity
  // Along with their attendance status if already marked
  const result = await sql.query<{
    child_id: string;
    child_name: string;
    child_gender: string;
    child_birth_date: Date;
    group_id: string;
    group_name: string;
    attendance_id: string | null;
    attendance_status: AttendanceStatus | null;
  }>(
    `
    SELECT DISTINCT
      ch.id as child_id,
      ch.name as child_name,
      ch.gender as child_gender,
      ch.birth_date as child_birth_date,
      g.id as group_id,
      g.name as group_name,
      att.id as attendance_id,
      att.status as attendance_status
    FROM children ch
    INNER JOIN children_groups cg ON cg.child_id = ch.id AND cg.active = true
    INNER JOIN groups g ON g.id = cg.group_id
    INNER JOIN activity_groups ag ON ag.group_id = g.id AND ag.activity_id = $1
    LEFT JOIN attendances att ON att.child_id = ch.id AND att.activity_occurrence_id = $2
    ORDER BY ch.name ASC
    `,
    [activityId, occurrenceId],
  );

  return result.rows;
}
