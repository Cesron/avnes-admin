import { sql } from "@/lib/sql";

export async function getAvailableMentorsOptions() {
  const result = await sql.query<{ id: string; name: string }>(
    `SELECT id, name FROM mentors WHERE user_id IS NULL ORDER BY name ASC`,
  );

  return result.rows;
}
