import { sql } from "@/lib/sql";

export async function getMentorsOptions() {
  const result = await sql.query(
    `SELECT id, name FROM mentors ORDER BY name ASC`
  );

  return result.rows;
}
