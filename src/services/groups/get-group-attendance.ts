import { sql } from "@/lib/sql";
import type { AttendanceMetrics } from "@/services/dashboard/get-weekly-dashboard";

// Use the same eligibility and denominators as the general attendance dashboard.
// Scope both activity participation and active membership to this group.
export const GROUP_ATTENDANCE_SQL = `WITH eligible AS MATERIALIZED (
  SELECT ao.id, ao.start_datetime
  FROM activity_occurrences ao
  WHERE ao.start_datetime >= $2::date AND ao.start_datetime < $3::date
    AND ao.end_datetime <= ($4::timestamptz AT TIME ZONE 'America/El_Salvador')
    AND ao.status NOT IN ('cancelled', 'canceled')
    AND EXISTS (SELECT 1 FROM activity_groups ag
      WHERE ag.activity_id = ao.activity_id AND ag.group_id = $1::uuid)
), expected AS (
  SELECT DISTINCT e.id AS occurrence_id, cg.child_id, att.status
  FROM eligible e
  JOIN children_groups cg ON cg.group_id = $1::uuid AND cg.active = true
  JOIN children child ON child.id = cg.child_id
  LEFT JOIN attendances att ON att.activity_occurrence_id = e.id
    AND att.child_id = cg.child_id
  WHERE child.created_at <= e.start_datetime OR att.id IS NOT NULL
)
SELECT COUNT(*)::int AS expected,
  COUNT(*) FILTER (WHERE status IN ('present', 'absent', 'excused'))::int AS recorded,
  COUNT(*) FILTER (WHERE status = 'present')::int AS present,
  COUNT(*) FILTER (WHERE status = 'absent')::int AS absent,
  COUNT(*) FILTER (WHERE status = 'excused')::int AS excused,
  COUNT(*) FILTER (WHERE status IS NULL OR status NOT IN ('present', 'absent', 'excused'))::int AS pending,
  (SELECT COUNT(*)::int FROM eligible) AS occurrences
FROM expected`;

export async function getGroupAttendance(
  groupId: string,
  start: string,
  endExclusive: string,
): Promise<AttendanceMetrics> {
  const result = await sql.query<AttendanceMetrics>(GROUP_ATTENDANCE_SQL, [
    groupId,
    start,
    endExclusive,
    new Date().toISOString(),
  ]);
  return result.rows[0];
}
