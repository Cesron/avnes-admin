import { sql } from "@/lib/sql";

export type MentorChildRow = {
  child_id: string;
  child_name: string;
  child_gender: string;
  group_id: string;
  group_name: string;
  club_name: string;
  present: number;
  total: number;
  attendance_pct: number;
  last_attendance_date: string | null;
};

type GetMentorChildrenWithAttendanceParams = {
  groupIds: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
};

export async function getMentorChildrenWithAttendance({
  groupIds,
  startDate,
  endDate,
}: GetMentorChildrenWithAttendanceParams): Promise<MentorChildRow[]> {
  if (groupIds.length === 0) {
    return [];
  }

  const result = await sql.query<MentorChildRow>(
    `
      SELECT
        ch.id as child_id,
        ch.name as child_name,
        ch.gender as child_gender,
        g.id as group_id,
        g.name as group_name,
        cl.name as club_name,
        COUNT(att.id) FILTER (WHERE att.status = 'present')::int as present,
        COUNT(att.id)::int as total,
        CASE
          WHEN COUNT(att.id) = 0 THEN 0
          ELSE ROUND(
            (COUNT(att.id) FILTER (WHERE att.status = 'present')::numeric
              / COUNT(att.id)::numeric) * 100
          )::int
        END as attendance_pct,
        MAX(ao.start_datetime::date)::text as last_attendance_date
      FROM children ch
      INNER JOIN children_groups cg ON cg.child_id = ch.id AND cg.active = true
      INNER JOIN groups g ON g.id = cg.group_id
      INNER JOIN clubs cl ON cl.id = g.club_id
      LEFT JOIN activity_groups ag ON ag.group_id = g.id
      LEFT JOIN activity_occurrences ao
        ON ao.activity_id = ag.activity_id
        AND ao.start_datetime::date >= $2::date
        AND ao.start_datetime::date <= $3::date
      LEFT JOIN attendances att
        ON att.child_id = ch.id
        AND att.activity_occurrence_id = ao.id
      WHERE g.id = ANY($1::uuid[])
      GROUP BY ch.id, ch.name, ch.gender, g.id, g.name, cl.name
      ORDER BY attendance_pct ASC, ch.name ASC
    `,
    [groupIds, startDate, endDate],
  );

  return result.rows;
}
