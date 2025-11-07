import { sql } from "@/lib/sql";
import type { Child } from "@/types/child";

export async function getChildren(): Promise<Child[]> {
  const result = await sql.query<Child>(`
      SELECT 
        id, 
        first_name,
        last_name,
        gender,
        birth_date
      FROM children
    `);

  return result.rows;
}
