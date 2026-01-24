import { sql } from "@/lib/sql";
import type { OccurrenceDetail } from "@/types/attendance";

export async function getOccurrenceDetail(
  occurrenceId: string,
): Promise<OccurrenceDetail | null> {
  // Get the occurrence with activity info
  const occurrenceResult = await sql.query<{
    occurrence_id: string;
    activity_id: string;
    activity_name: string;
    activity_description: string | null;
    start_datetime: Date;
    end_datetime: Date;
    status: string;
  }>(
    `
    SELECT 
      ao.id as occurrence_id,
      a.id as activity_id,
      a.name as activity_name,
      a.description as activity_description,
      ao.start_datetime,
      ao.end_datetime,
      ao.status
    FROM activity_occurrences ao
    INNER JOIN activities a ON a.id = ao.activity_id
    WHERE ao.id = $1
    `,
    [occurrenceId],
  );

  if (occurrenceResult.rows.length === 0) {
    return null;
  }

  const occurrence = occurrenceResult.rows[0];

  // Get the groups for this activity
  const groupsResult = await sql.query<{
    id: string;
    name: string;
    club_name: string;
  }>(
    `
    SELECT 
      g.id,
      g.name,
      c.name as club_name
    FROM activity_groups ag
    INNER JOIN groups g ON g.id = ag.group_id
    INNER JOIN clubs c ON c.id = g.club_id
    WHERE ag.activity_id = $1
    ORDER BY c.name ASC, g.name ASC
    `,
    [occurrence.activity_id],
  );

  return {
    ...occurrence,
    groups: groupsResult.rows,
  };
}
