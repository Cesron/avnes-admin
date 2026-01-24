import { sql } from "@/lib/sql";

type CreateOccurrenceParams = {
  activityId: string;
  date: string; // Format: YYYY-MM-DD
};

export async function createOccurrence({
  activityId,
  date,
}: CreateOccurrenceParams): Promise<string> {
  // First check if occurrence already exists for this activity on this date
  const existingResult = await sql.query<{ id: string }>(
    `
    SELECT id FROM activity_occurrences 
    WHERE activity_id = $1 AND start_datetime::date = $2::date
    `,
    [activityId, date],
  );

  if (existingResult.rows.length > 0) {
    return existingResult.rows[0].id;
  }

  // Get the recurrence to get the start_time and end_time
  const recurrenceResult = await sql.query<{
    start_time: string;
    end_time: string;
  }>(
    `
    SELECT start_time::text, end_time::text 
    FROM activity_recurrences 
    WHERE activity_id = $1
    `,
    [activityId],
  );

  if (recurrenceResult.rows.length === 0) {
    throw new Error("No recurrence found for this activity");
  }

  const { start_time, end_time } = recurrenceResult.rows[0];

  // Create the occurrence
  const startDatetime = `${date} ${start_time}`;
  const endDatetime = `${date} ${end_time}`;

  const result = await sql.query<{ id: string }>(
    `
    INSERT INTO activity_occurrences (activity_id, start_datetime, end_datetime, status)
    VALUES ($1, $2, $3, 'scheduled')
    RETURNING id
    `,
    [activityId, startDatetime, endDatetime],
  );

  return result.rows[0].id;
}
