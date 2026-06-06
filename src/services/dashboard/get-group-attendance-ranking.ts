import { sql } from "@/lib/sql";

export type GroupAttendance = {
  group_id: string;
  group_name: string;
  club_name: string;
  present: number;
  total: number;
  percentage: number;
};

type GetGroupAttendanceRankingParams = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  limit?: number;
  /** "top" (default) = highest attendance, "bottom" = lowest */
  order?: "top" | "bottom";
};

export async function getGroupAttendanceRanking({
  startDate,
  endDate,
  limit = 5,
  order = "top",
}: GetGroupAttendanceRankingParams): Promise<GroupAttendance[]> {
  const orderClause = order === "top" ? "DESC" : "ASC";

  const result = await sql.query<GroupAttendance>(
    `
      SELECT
        g.id as group_id,
        g.name as group_name,
        c.name as club_name,
        COUNT(*) FILTER (WHERE att.status = 'present')::int as present,
        COUNT(*)::int as total,
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(
            (COUNT(*) FILTER (WHERE att.status = 'present')::numeric
              / COUNT(*)::numeric) * 100
          )::int
        END as percentage
      FROM groups g
      INNER JOIN clubs c ON c.id = g.club_id
      LEFT JOIN activity_groups ag ON ag.group_id = g.id
      LEFT JOIN activity_occurrences ao
        ON ao.activity_id = ag.activity_id
        AND ao.start_datetime::date >= $1::date
        AND ao.start_datetime::date <= $2::date
      LEFT JOIN attendances att ON att.activity_occurrence_id = ao.id
      GROUP BY g.id, g.name, c.name
      HAVING COUNT(*) > 0
      ORDER BY percentage ${orderClause}, g.name ASC
      LIMIT $3
    `,
    [startDate, endDate, limit],
  );

  return result.rows;
}
