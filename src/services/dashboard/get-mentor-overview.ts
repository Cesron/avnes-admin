import { sql } from "@/lib/sql";

export type MentorOverview = {
  childrenCount: number;
  attendancePct: number;
  attendanceAttended: number;
  attendanceTotal: number;
  upcomingActivities: number;
  myGroups: { id: string; name: string; club_name: string }[];
};

type GetMentorOverviewParams = {
  groupIds: string[];
  /** First day of the current month (YYYY-MM-DD) */
  monthStart: string;
  /** Last day of the current month (YYYY-MM-DD) */
  monthEnd: string;
};

export async function getMentorOverview({
  groupIds,
  monthStart,
  monthEnd,
}: GetMentorOverviewParams): Promise<MentorOverview> {
  // No groups assigned → return zeroed stats
  if (groupIds.length === 0) {
    return {
      childrenCount: 0,
      attendancePct: 0,
      attendanceAttended: 0,
      attendanceTotal: 0,
      upcomingActivities: 0,
      myGroups: [],
    };
  }

  const groupsResult = await sql.query<{
    id: string;
    name: string;
    club_name: string;
  }>(
    `
      SELECT g.id, g.name, c.name as club_name
      FROM groups g
      INNER JOIN clubs c ON c.id = g.club_id
      WHERE g.id = ANY($1::uuid[])
      ORDER BY c.name, g.name
    `,
    [groupIds],
  );

  const [childrenRow, attendanceRow, upcomingRow] = await Promise.all([
    sql.query<{ count: number }>(
      `
        SELECT COUNT(DISTINCT cg.child_id)::int as count
        FROM children_groups cg
        WHERE cg.group_id = ANY($1::uuid[])
          AND cg.active = true
      `,
      [groupIds],
    ),
    sql.query<{ attended: number; total: number }>(
      `
        SELECT
          COUNT(*) FILTER (WHERE att.status = 'present')::int as attended,
          COUNT(*)::int as total
        FROM attendances att
        INNER JOIN activity_occurrences ao ON ao.id = att.activity_occurrence_id
        INNER JOIN activity_groups ag ON ag.activity_id = ao.activity_id
        WHERE ag.group_id = ANY($1::uuid[])
          AND ao.start_datetime::date >= $2::date
          AND ao.start_datetime::date <= $3::date
      `,
      [groupIds, monthStart, monthEnd],
    ),
    sql.query<{ count: number }>(
      `
        SELECT COUNT(DISTINCT ao.id)::int as count
        FROM activity_occurrences ao
        INNER JOIN activity_groups ag ON ag.activity_id = ao.activity_id
        WHERE ag.group_id = ANY($1::uuid[])
          AND ao.start_datetime >= NOW()
          AND ao.start_datetime::date <= (NOW()::date + INTERVAL '7 days')::date
      `,
      [groupIds],
    ),
  ]);

  const total = attendanceRow.rows[0]?.total ?? 0;
  const attended = attendanceRow.rows[0]?.attended ?? 0;
  const attendancePct = total > 0 ? Math.round((attended / total) * 100) : 0;

  return {
    childrenCount: childrenRow.rows[0]?.count ?? 0,
    attendancePct,
    attendanceAttended: attended,
    attendanceTotal: total,
    upcomingActivities: upcomingRow.rows[0]?.count ?? 0,
    myGroups: groupsResult.rows,
  };
}
