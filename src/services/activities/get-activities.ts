import { sql } from "@/lib/sql";

export type ActivityWithDetails = {
  id: string;
  name: string;
  description: string | null;
  is_recurring: boolean;
  created_at: Date;
  updated_at: Date;
  // Recurrence data (if applicable)
  recurrence_id: string | null;
  frequency: string | null;
  interval: number | null;
  days_of_week: string | null;
  start_date: Date | null;
  end_date: Date | null;
  start_time: string | null;
  end_time: string | null;
  // Groups (comma separated)
  group_names: string | null;
  // Next occurrence
  next_occurrence: Date | null;
};

export async function getActivities(): Promise<ActivityWithDetails[]> {
  const result = await sql.query<ActivityWithDetails>(`
    SELECT 
      a.id,
      a.name,
      a.description,
      a.is_recurring,
      a.created_at,
      a.updated_at,
      ar.id as recurrence_id,
      ar.frequency,
      ar.interval,
      ar.days_of_week,
      ar.start_date,
      ar.end_date,
      ar.start_time,
      ar.end_time,
      STRING_AGG(g.name, ', ' ORDER BY g.name) as group_names,
      (
        SELECT MIN(ao.start_datetime)
        FROM activity_occurrences ao
        WHERE ao.activity_id = a.id
          AND ao.start_datetime >= NOW()
          AND ao.status = 'scheduled'
      ) as next_occurrence
    FROM activities a
    LEFT JOIN activity_recurrences ar ON ar.activity_id = a.id
    LEFT JOIN activity_groups ag ON ag.activity_id = a.id
    LEFT JOIN groups g ON g.id = ag.group_id
    GROUP BY a.id, ar.id
    ORDER BY a.created_at DESC
  `);

  return result.rows;
}
