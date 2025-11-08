import { sql } from "@/lib/sql";
import type { Group } from "@/types/group";

export async function getGroups(): Promise<Group[]> {
  const result = await sql.query<Group>(`
      SELECT 
        g.id, 
        g.name,
        g.club_id,
        g.mentor_id,
        c.name as club_name,
        m.name as mentor_name
      FROM groups g
      INNER JOIN clubs c ON g.club_id = c.id
      INNER JOIN mentors m ON g.mentor_id = m.id
      ORDER BY g.id ASC
    `);

  return result.rows;
}
