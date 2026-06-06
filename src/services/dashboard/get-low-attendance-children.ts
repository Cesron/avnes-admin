import { sql } from "@/lib/sql";

export type LowAttendanceChild = {
  child_id: string;
  child_name: string;
  group_name: string;
  club_name: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
};

type GetLowAttendanceChildrenParams = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  /** Threshold percentage (0-100). Children below this are returned. */
  threshold?: number;
  limit?: number;
};

export async function getLowAttendanceChildren({
  startDate,
  endDate,
  threshold = 70,
  limit = 5,
}: GetLowAttendanceChildrenParams): Promise<LowAttendanceChild[]> {
  const result = await sql.query<LowAttendanceChild>(
    `
      SELECT
        ch.id as child_id,
        ch.name as child_name,
        g.name as group_name,
        cl.name as club_name,
        COUNT(*) FILTER (WHERE att.status = 'present')::int as present,
        COUNT(*) FILTER (WHERE att.status = 'absent')::int as absent,
        COUNT(*)::int as total,
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(
            (COUNT(*) FILTER (WHERE att.status = 'present')::numeric
              / COUNT(*)::numeric) * 100
          )::int
        END as percentage
      FROM children ch
      INNER JOIN children_groups cg ON cg.child_id = ch.id AND cg.active = true
      INNER JOIN groups g ON g.id = cg.group_id
      INNER JOIN clubs cl ON cl.id = g.club_id
      INNER JOIN activity_groups ag ON ag.group_id = g.id
      INNER JOIN activity_occurrences ao
        ON ao.activity_id = ag.activity_id
        AND ao.start_datetime::date >= $1::date
        AND ao.start_datetime::date <= $2::date
      LEFT JOIN attendances att
        ON att.activity_occurrence_id = ao.id
        AND att.child_id = ch.id
      GROUP BY ch.id, ch.name, g.name, cl.name
      HAVING COUNT(*) > 0
        AND (
          (COUNT(*) FILTER (WHERE att.status = 'present')::numeric
            / COUNT(*)::numeric) * 100
        ) < $3
      ORDER BY percentage ASC, absent DESC
      LIMIT $4
    `,
    [startDate, endDate, threshold, limit],
  );

  return result.rows;
}
