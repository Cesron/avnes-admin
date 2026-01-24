import { sql } from "@/lib/sql";

export type GroupOption = {
  id: string;
  name: string;
  club_name: string;
};

export async function getGroupsOptions(): Promise<GroupOption[]> {
  const result = await sql.query<GroupOption>(`
    SELECT 
      g.id, 
      g.name,
      c.name as club_name
    FROM groups g
    INNER JOIN clubs c ON g.club_id = c.id
    ORDER BY c.name ASC, g.name ASC
  `);

  return result.rows;
}
