import { sql } from "@/lib/sql";
import type { TodayActivity } from "@/types/attendance";

type GetTodayActivitiesParams = {
  clubId?: string;
  groupId?: string;
  date?: string; // Format: YYYY-MM-DD, defaults to today
};

export async function getTodayActivities({
  clubId,
  groupId,
  date,
}: GetTodayActivitiesParams = {}): Promise<TodayActivity[]> {
  // Use provided date or today
  const targetDate = date || new Date().toISOString().split("T")[0];
  const dayOfWeek = new Date(targetDate).getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Map JS day (0-6) to our days_of_week format (full names as stored in DB)
  const dayMap = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const todayDayName = dayMap[dayOfWeek];

  // Build WHERE conditions for club and group filters
  let clubCondition = "";
  let groupCondition = "";
  const params: (string | number)[] = [targetDate, todayDayName];
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

  const result = await sql.query<TodayActivity>(
    `
    WITH recurring_activities AS (
      -- Get recurring activities that apply today
      SELECT 
        a.id as activity_id,
        a.name as activity_name,
        a.is_recurring,
        g.id as group_id,
        g.name as group_name,
        c.id as club_id,
        c.name as club_name,
        ar.start_time::text as start_time,
        ar.end_time::text as end_time,
        NULL::uuid as occurrence_id,
        EXISTS (
          SELECT 1 FROM activity_occurrences ao 
          WHERE ao.activity_id = a.id 
          AND ao.start_datetime::date = $1::date
        ) as has_occurrence_today
      FROM activities a
      INNER JOIN activity_recurrences ar ON ar.activity_id = a.id
      INNER JOIN activity_groups ag ON ag.activity_id = a.id
      INNER JOIN groups g ON g.id = ag.group_id
      INNER JOIN clubs c ON c.id = g.club_id
      WHERE a.is_recurring = true
        AND ar.start_date <= $1::date
        AND (ar.end_date IS NULL OR ar.end_date >= $1::date)
        AND ar.days_of_week LIKE '%' || $2 || '%'
        ${clubCondition}
        ${groupCondition}
    ),
    non_recurring_activities AS (
      -- Get non-recurring activities scheduled for today
      SELECT 
        a.id as activity_id,
        a.name as activity_name,
        a.is_recurring,
        g.id as group_id,
        g.name as group_name,
        c.id as club_id,
        c.name as club_name,
        ao.start_datetime::time::text as start_time,
        ao.end_datetime::time::text as end_time,
        ao.id as occurrence_id,
        true as has_occurrence_today
      FROM activities a
      INNER JOIN activity_occurrences ao ON ao.activity_id = a.id
      INNER JOIN activity_groups ag ON ag.activity_id = a.id
      INNER JOIN groups g ON g.id = ag.group_id
      INNER JOIN clubs c ON c.id = g.club_id
      WHERE a.is_recurring = false
        AND ao.start_datetime::date = $1::date
        ${clubCondition}
        ${groupCondition}
    )
    SELECT * FROM recurring_activities
    UNION ALL
    SELECT * FROM non_recurring_activities
    ORDER BY start_time ASC, activity_name ASC
    `,
    params,
  );

  return result.rows;
}
