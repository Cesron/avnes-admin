import { sql } from "@/lib/sql";
import type { Club } from "@/types/club";

export async function getClubs(): Promise<Club[]> {
  const result = await sql.query<Club>(`
      SELECT 
        id, 
        name
      FROM clubs
    `);

  return result.rows;
}
