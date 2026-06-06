import { sql } from "@/lib/sql";

export type AdminOverview = {
  clubsCount: number;
  groupsCount: number;
  mentorsCount: number;
  childrenCount: number;
  activitiesCount: number;
  attendancePct: number;
  attendanceAttended: number;
  attendanceTotal: number;
};

type GetAdminOverviewParams = {
  monthStart: string; // YYYY-MM-DD
  monthEnd: string; // YYYY-MM-DD
};

export async function getAdminOverview({
  monthStart,
  monthEnd,
}: GetAdminOverviewParams): Promise<AdminOverview> {
  const [clubs, groups, mentors, children, activities, attendance] =
    await Promise.all([
      sql.query<{ count: number }>(`SELECT COUNT(*)::int as count FROM clubs`),
      sql.query<{ count: number }>(`SELECT COUNT(*)::int as count FROM groups`),
      sql.query<{ count: number }>(
        `SELECT COUNT(*)::int as count FROM mentors`,
      ),
      sql.query<{ count: number }>(
        `SELECT COUNT(*)::int as count FROM children`,
      ),
      sql.query<{ count: number }>(
        `SELECT COUNT(*)::int as count FROM activities`,
      ),
      sql.query<{ attended: number; total: number }>(
        `
          SELECT
            COUNT(*) FILTER (WHERE att.status = 'present')::int as attended,
            COUNT(*)::int as total
          FROM attendances att
          INNER JOIN activity_occurrences ao
            ON ao.id = att.activity_occurrence_id
          WHERE ao.start_datetime::date >= $1::date
            AND ao.start_datetime::date <= $2::date
        `,
        [monthStart, monthEnd],
      ),
    ]);

  const total = attendance.rows[0]?.total ?? 0;
  const attended = attendance.rows[0]?.attended ?? 0;
  const attendancePct = total > 0 ? Math.round((attended / total) * 100) : 0;

  return {
    clubsCount: clubs.rows[0]?.count ?? 0,
    groupsCount: groups.rows[0]?.count ?? 0,
    mentorsCount: mentors.rows[0]?.count ?? 0,
    childrenCount: children.rows[0]?.count ?? 0,
    activitiesCount: activities.rows[0]?.count ?? 0,
    attendancePct,
    attendanceAttended: attended,
    attendanceTotal: total,
  };
}
