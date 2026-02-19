import { sql } from "@/lib/sql";
import type { WeekOccurrence } from "@/types/attendance";

type GetWeekOccurrencesParams = {
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string; // YYYY-MM-DD (Sunday)
  clubId?: string;
  groupId?: string;
  /** When set, only occurrences for these group IDs are returned (role-based filter) */
  mentorGroupIds?: string[];
};

export async function getWeekOccurrences({
  startDate,
  endDate,
  clubId,
  groupId,
  mentorGroupIds,
}: GetWeekOccurrencesParams): Promise<WeekOccurrence[]> {
  let clubCondition = "";
  let groupCondition = "";
  let mentorGroupCondition = "";
  const params: (string | string[])[] = [startDate, endDate];
  let paramIndex = 3;

  if (clubId) {
    clubCondition = `AND c.id = $${paramIndex}`;
    params.push(clubId);
    paramIndex++;
  }

  if (groupId) {
    groupCondition = `AND g.id = $${paramIndex}`;
    params.push(groupId);
    paramIndex++;
  }

  if (mentorGroupIds && mentorGroupIds.length > 0) {
    const placeholders = mentorGroupIds
      .map((_, i) => `$${paramIndex + i}`)
      .join(", ");
    mentorGroupCondition = `AND g.id IN (${placeholders})`;
    for (const id of mentorGroupIds) {
      params.push(id);
    }
    paramIndex += mentorGroupIds.length;
  }

  const result = await sql.query<WeekOccurrence>(
    `
    SELECT 
      ao.id as occurrence_id,
      a.id as activity_id,
      a.name as activity_name,
      a.is_recurring,
      ao.start_datetime::text as start_datetime,
      ao.end_datetime::text as end_datetime,
      ao.status,
      STRING_AGG(DISTINCT g.name, ', ' ORDER BY g.name) as group_names,
      STRING_AGG(DISTINCT c.name, ', ' ORDER BY c.name) as club_names,
      COUNT(DISTINCT att.id)::int as attendance_count
    FROM activity_occurrences ao
    INNER JOIN activities a ON a.id = ao.activity_id
    INNER JOIN activity_groups ag ON ag.activity_id = a.id
    INNER JOIN groups g ON g.id = ag.group_id
    INNER JOIN clubs c ON c.id = g.club_id
    LEFT JOIN attendances att ON att.activity_occurrence_id = ao.id
    WHERE ao.start_datetime::date >= $1::date
      AND ao.start_datetime::date <= $2::date
      ${clubCondition}
      ${groupCondition}
      ${mentorGroupCondition}
    GROUP BY ao.id, a.id
    ORDER BY ao.start_datetime ASC, a.name ASC
    `,
    params,
  );

  return result.rows;
}
