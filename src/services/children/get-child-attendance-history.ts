import type { SessionUserInfo } from "@/lib/auth-utils";
import { sql } from "@/lib/sql";
import type { AttendanceStatus } from "@/types/attendance";

export const HISTORY_PAGE_SIZE = 25;
export type HistoryFilters = { from: string; to: string; page: number };
export function parseHistoryFilters(
  query: Record<string, string | string[] | undefined>,
): HistoryFilters | null {
  const from = typeof query.from === "string" ? query.from : "";
  const to = typeof query.to === "string" ? query.to : "";
  const validDate = (value: string) => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  };
  if (!validDate(from) || !validDate(to) || (from && to && from > to))
    return null;
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  return { from, to, page: Number.isSafeInteger(page) && page > 0 ? page : 1 };
}

export async function getChildAttendanceHistory(
  childId: string,
  user: Pick<SessionUserInfo, "userId" | "role">,
  filters: HistoryFilters,
) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      childId,
    )
  )
    return null;
  if (!["admin", "coordinator", "mentor"].includes(user.role ?? ""))
    return null;
  // Resolve membership from the authenticated user's ID, never from URL group IDs.
  const child = await sql.query<{
    id: string;
    name: string;
    penpal_code: string | null;
  }>(
    `
    SELECT c.id, c.name, f.penpal_code FROM children c
    LEFT JOIN families f ON f.id = c.family_id
    WHERE c.id = $1 AND ($2::text IN ('admin', 'coordinator') OR
      ($2::text = 'mentor' AND EXISTS (
        SELECT 1 FROM children_groups cg
        JOIN groups g ON g.id = cg.group_id
        JOIN mentors m ON m.id = g.mentor_id
        WHERE cg.child_id = c.id AND cg.active = true AND m.user_id = $3
      )))`,
    [childId, user.role, user.userId],
  );
  if (!child.rows[0]) return null;
  const values = [childId, filters.from || null, filters.to || null];
  const where = `att.child_id = $1
    AND ($2::date IS NULL OR ao.start_datetime >= $2::date)
    AND ($3::date IS NULL OR ao.start_datetime < $3::date + INTERVAL '1 day')`;
  const summary = await sql.query<{
    total: number;
    present: number;
    absent: number;
    excused: number;
  }>(
    `
    SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE att.status = 'present')::int AS present,
      COUNT(*) FILTER (WHERE att.status = 'absent')::int AS absent,
      COUNT(*) FILTER (WHERE att.status = 'excused')::int AS excused
    FROM attendances att JOIN activity_occurrences ao ON ao.id = att.activity_occurrence_id
    WHERE ${where}`,
    values,
  );
  const totals = summary.rows[0];
  const pages = Math.max(1, Math.ceil(totals.total / HISTORY_PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const rows = await sql.query<{
    id: string;
    activity_name: string;
    date: string;
    time: string;
    status: AttendanceStatus;
    notes: string | null;
  }>(
    `
    SELECT att.id, a.name AS activity_name,
      to_char(ao.start_datetime, 'YYYY-MM-DD') AS date,
      to_char(ao.start_datetime, 'HH24:MI') AS time, att.status, att.notes
    FROM attendances att
    JOIN activity_occurrences ao ON ao.id = att.activity_occurrence_id
    JOIN activities a ON a.id = ao.activity_id
    WHERE ${where}
    ORDER BY ao.start_datetime DESC, att.id DESC
    LIMIT $4 OFFSET $5`,
    [...values, HISTORY_PAGE_SIZE, (page - 1) * HISTORY_PAGE_SIZE],
  );
  return {
    child: child.rows[0],
    summary: totals,
    items: rows.rows,
    page,
    pages,
  };
}
