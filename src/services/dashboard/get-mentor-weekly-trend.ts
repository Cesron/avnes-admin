import { sql } from "@/lib/sql";

export type WeeklyTrendPoint = {
  date: string; // YYYY-MM-DD
  dayLabel: string; // L, M, M, J, V, S, D
  present: number;
  absent: number;
  excused: number;
  total: number;
  percentage: number;
};

type GetMentorWeeklyTrendParams = {
  groupIds: string[];
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string; // YYYY-MM-DD (Sunday)
};

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export async function getMentorWeeklyTrend({
  groupIds,
  startDate,
  endDate,
}: GetMentorWeeklyTrendParams): Promise<WeeklyTrendPoint[]> {
  if (groupIds.length === 0) {
    return [];
  }

  const result = await sql.query<{
    day: string;
    present: number;
    absent: number;
    excused: number;
    total: number;
  }>(
    `
      SELECT
        ao.start_datetime::date::text as day,
        COUNT(*) FILTER (WHERE att.status = 'present')::int as present,
        COUNT(*) FILTER (WHERE att.status = 'absent')::int as absent,
        COUNT(*) FILTER (WHERE att.status = 'excused')::int as excused,
        COUNT(*)::int as total
      FROM attendances att
      INNER JOIN activity_occurrences ao ON ao.id = att.activity_occurrence_id
      INNER JOIN activity_groups ag ON ag.activity_id = ao.activity_id
      WHERE ag.group_id = ANY($1::uuid[])
        AND ao.start_datetime::date >= $2::date
        AND ao.start_datetime::date <= $3::date
      GROUP BY ao.start_datetime::date
      ORDER BY day ASC
    `,
    [groupIds, startDate, endDate],
  );

  // Build a full 7-day window so empty days still appear
  const map = new Map<string, (typeof result.rows)[number]>();
  for (const row of result.rows) {
    map.set(row.day, row);
  }

  const start = new Date(`${startDate}T00:00:00`);
  const points: WeeklyTrendPoint[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const dayLabel = i === 0 ? "Lun" : i === 6 ? "Dom" : DAY_LABELS[d.getDay()];
    const row = map.get(key);

    const total = row?.total ?? 0;
    const present = row?.present ?? 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    points.push({
      date: key,
      dayLabel,
      present,
      absent: row?.absent ?? 0,
      excused: row?.excused ?? 0,
      total,
      percentage,
    });
  }

  return points;
}
