import { sql } from "@/lib/sql";

export type ClubAttendance = {
  club_id: string;
  club_name: string;
  present: number;
  total: number;
  percentage: number;
};

type GetClubAttendanceParams = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
};

export async function getClubAttendance({
  startDate,
  endDate,
}: GetClubAttendanceParams): Promise<ClubAttendance[]> {
  const result = await sql.query<ClubAttendance>(
    `
      SELECT
        c.id as club_id,
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
      FROM clubs c
      LEFT JOIN groups g ON g.club_id = c.id
      LEFT JOIN activity_groups ag ON ag.group_id = g.id
      LEFT JOIN activity_occurrences ao
        ON ao.activity_id = ag.activity_id
        AND ao.start_datetime::date >= $1::date
        AND ao.start_datetime::date <= $2::date
      LEFT JOIN attendances att ON att.activity_occurrence_id = ao.id
      GROUP BY c.id, c.name
      ORDER BY percentage DESC, c.name ASC
    `,
    [startDate, endDate],
  );

  return result.rows;
}
