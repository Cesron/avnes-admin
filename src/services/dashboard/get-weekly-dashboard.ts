import { sql } from "@/lib/sql";

export type AttendanceMetrics = {
  expected: number;
  recorded: number;
  present: number;
  absent: number;
  excused: number;
  pending: number;
  occurrences: number;
};
export type AttendanceBreakdown = AttendanceMetrics & {
  id: string;
  name: string;
  club_name?: string;
};
export type PendingOccurrence = {
  id: string;
  name: string;
  date: string;
  groups: string;
  pending: number;
  expected: number;
};
export type WeeklyDashboard = {
  summary: AttendanceMetrics;
  clubs: AttendanceBreakdown[];
  groups: AttendanceBreakdown[];
  pending: PendingOccurrence[];
  pendingCount: number;
};

// The grain is one child per occurrence. Shared activities must not multiply attendance.
const metrics = `COUNT(*)::int AS expected,
  COUNT(*) FILTER (WHERE status IN ('present', 'absent', 'excused'))::int AS recorded,
  COUNT(*) FILTER (WHERE status = 'present')::int AS present,
  COUNT(*) FILTER (WHERE status = 'absent')::int AS absent,
  COUNT(*) FILTER (WHERE status = 'excused')::int AS excused,
  COUNT(*) FILTER (WHERE status IS NULL OR status NOT IN ('present', 'absent', 'excused'))::int AS pending,
  COUNT(DISTINCT occurrence_id)::int AS occurrences`;

export const WEEKLY_DASHBOARD_SQL = `WITH eligible AS MATERIALIZED (
  SELECT id, activity_id, start_datetime FROM activity_occurrences
  WHERE start_datetime >= $1::date AND start_datetime < $2::date
    AND end_datetime <= ($4::timestamptz AT TIME ZONE 'America/El_Salvador')
    AND status NOT IN ('cancelled', 'canceled')
), scoped_groups AS (
  SELECT g.id, g.name, g.club_id, c.name AS club_name FROM groups g
  JOIN clubs c ON c.id = g.club_id
  WHERE ($3::uuid IS NULL OR g.club_id = $3::uuid)
), expected AS MATERIALIZED (
  SELECT DISTINCT e.id AS occurrence_id, cg.child_id, g.id AS group_id,
    g.club_id, att.status
  FROM eligible e
  JOIN activity_groups ag ON ag.activity_id = e.activity_id
  JOIN scoped_groups g ON g.id = ag.group_id
  JOIN children_groups cg ON cg.group_id = g.id AND cg.active = true
  JOIN children child ON child.id = cg.child_id
  LEFT JOIN attendances att ON att.activity_occurrence_id = e.id AND att.child_id = cg.child_id
  WHERE child.created_at <= e.start_datetime OR att.id IS NOT NULL
), unique_attendance AS (
  SELECT DISTINCT occurrence_id, child_id, status FROM expected
), summary AS (SELECT ${metrics} FROM unique_attendance),
club_stats AS (
  SELECT club_id, ${metrics} FROM (
    SELECT DISTINCT club_id, occurrence_id, child_id, status FROM expected
  ) deduplicated GROUP BY club_id
), group_stats AS (
  SELECT group_id, ${metrics} FROM expected GROUP BY group_id
), pending_stats AS (
  SELECT occurrence_id, ${metrics} FROM unique_attendance GROUP BY occurrence_id
), pending_list AS (
  SELECT e.id, a.name, e.start_datetime::date::text AS date,
    p.pending, p.expected,
    (SELECT STRING_AGG(DISTINCT g.name, ', ' ORDER BY g.name)
     FROM expected ex JOIN scoped_groups g ON g.id = ex.group_id WHERE ex.occurrence_id = e.id) AS groups
  FROM pending_stats p JOIN eligible e ON e.id = p.occurrence_id
  JOIN activities a ON a.id = e.activity_id
  WHERE p.pending > 0 ORDER BY e.start_datetime, e.id LIMIT 8
)
SELECT json_build_object(
  'summary', (SELECT row_to_json(s) FROM summary s),
  'clubs', COALESCE((SELECT json_agg(row_to_json(c) ORDER BY c.name) FROM (
    SELECT c.id, c.name, s.expected, s.recorded, s.present, s.absent, s.excused, s.pending, s.occurrences
    FROM clubs c LEFT JOIN club_stats s ON s.club_id = c.id
    WHERE ($3::uuid IS NULL OR c.id = $3::uuid)
  ) c), '[]'::json),
  'groups', COALESCE((SELECT json_agg(row_to_json(g) ORDER BY g.club_name, g.name) FROM (
    SELECT g.id, g.name, g.club_name, s.expected, s.recorded, s.present, s.absent, s.excused, s.pending, s.occurrences
    FROM scoped_groups g LEFT JOIN group_stats s ON s.group_id = g.id
  ) g), '[]'::json),
  'pending', COALESCE((SELECT json_agg(row_to_json(p)) FROM pending_list p), '[]'::json),
  'pendingCount', (SELECT COUNT(*)::int FROM pending_stats WHERE pending > 0)
) AS data`;

export function attendancePercentage(
  metrics: Pick<AttendanceMetrics, "present" | "absent">,
) {
  const total = metrics.present + metrics.absent;
  return total > 0 ? Math.round((metrics.present / total) * 100) : null;
}

export async function getWeeklyDashboard(
  start: string,
  endExclusive: string,
  clubId?: string,
): Promise<WeeklyDashboard> {
  const result = await sql.query<{ data: WeeklyDashboard }>(
    WEEKLY_DASHBOARD_SQL,
    [start, endExclusive, clubId ?? null, new Date().toISOString()],
  );
  const data = result.rows[0].data;
  // LEFT JOIN rows without activity are empty, not a zero-percent attendance result.
  for (const row of [...data.clubs, ...data.groups]) {
    for (const key of [
      "expected",
      "recorded",
      "present",
      "absent",
      "excused",
      "pending",
      "occurrences",
    ] as const)
      row[key] ??= 0;
  }
  return data;
}
