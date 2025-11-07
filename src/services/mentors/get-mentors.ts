import { sql } from "@/lib/sql";
import type { Mentor } from "@/types/mentor";

export async function getMentors(): Promise<Mentor[]> {
  const result = await sql.query<Mentor>(`
      SELECT 
        id, 
        name,
        phone,
        email
      FROM mentors
    `);

  return result.rows;
}
