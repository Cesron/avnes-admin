import { sql } from "@/lib/sql";

export type ActivityForEdit = {
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
  // Group IDs array
  group_ids: string[];
  // Next occurrence (for non-recurring)
  next_occurrence: Date | null;
};

export async function getActivityForEdit(
  activityId: string,
): Promise<ActivityForEdit | null> {
  const result = await sql.query<
    Omit<ActivityForEdit, "group_ids"> & { group_ids: string }
  >(
    `
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
      COALESCE(
        (SELECT STRING_AGG(ag.group_id::text, ',') FROM activity_groups ag WHERE ag.activity_id = a.id),
        ''
      ) as group_ids,
      (
        SELECT MIN(ao.start_datetime)
        FROM activity_occurrences ao
        WHERE ao.activity_id = a.id
          AND ao.start_datetime >= NOW()
          AND ao.status = 'scheduled'
      ) as next_occurrence
    FROM activities a
    LEFT JOIN activity_recurrences ar ON ar.activity_id = a.id
    WHERE a.id = $1
  `,
    [activityId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    ...row,
    group_ids: row.group_ids ? row.group_ids.split(",") : [],
  };
}
