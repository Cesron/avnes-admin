import { localToday } from "@/lib/dashboard-week";
import { sql } from "@/lib/sql";
import type { TodayActivity } from "@/types/attendance";

type GetTodayActivitiesParams = {
  clubId?: string;
  groupIds?: string[];
  date?: string;
};

export async function getTodayActivities({
  clubId,
  groupIds,
  date = localToday(),
}: GetTodayActivitiesParams = {}): Promise<TodayActivity[]> {
  const result = await sql.query<TodayActivity>(
    `
    SELECT a.name AS activity_name, g.id AS group_id, g.name AS group_name,
      c.name AS club_name, ao.id AS occurrence_id,
      ao.start_datetime::time::text AS start_time,
      ao.end_datetime::time::text AS end_time
    FROM activity_occurrences ao
    JOIN activities a ON a.id = ao.activity_id
    JOIN activity_groups ag ON ag.activity_id = a.id
    JOIN groups g ON g.id = ag.group_id
    JOIN clubs c ON c.id = g.club_id
    WHERE ao.start_datetime >= $1::date
      AND ao.start_datetime < $1::date + INTERVAL '1 day'
      AND ao.status NOT IN ('cancelled', 'canceled')
      AND ($2::uuid IS NULL OR c.id = $2)
      AND ($3::uuid[] IS NULL OR g.id = ANY($3))
    ORDER BY ao.start_datetime, a.name, g.name
    `,
    [date, clubId ?? null, groupIds ?? null],
  );
  return result.rows;
}
