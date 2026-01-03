import { sql } from "@/lib/sql";
import type { Child } from "@/types/child";

export type ChildWithFamily = Child & {
  penpal_code: string;
  family_biography_url: string | null;
  family_photo_url: string | null;
};

export async function getChildren(): Promise<ChildWithFamily[]> {
  const result = await sql.query<ChildWithFamily>(`
      SELECT 
        c.id, 
        c.first_name,
        c.last_name,
        c.gender,
        c.birth_date,
        c.family_id,
        c.pamphlet_url,
        c.child_photo_url,
        c.created_at,
        c.updated_at,
        f.penpal_code,
        f.family_biography_url,
        f.family_photo_url
      FROM children c
      INNER JOIN families f ON c.family_id = f.id
      ORDER BY c.created_at DESC
    `);

  return result.rows;
}
