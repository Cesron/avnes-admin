import { sql } from "@/lib/sql";

export async function getClubsOptions() {
  const result = await sql.query(
    `SELECT id, name FROM clubs ORDER BY name ASC`
  );

  return result.rows;
}
