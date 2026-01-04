import { sql } from "@/lib/sql";
import type { Child } from "@/types/child";

export type ChildWithFamily = Child & {
  penpal_code: string | null;
  family_biography_url: string | null;
  family_photo_url: string | null;
};

export async function getChildren(): Promise<ChildWithFamily[]> {
  const result = await sql.query<ChildWithFamily>(`
      SELECT 
        c.id, 
        c.name,
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
      LEFT JOIN families f ON c.family_id = f.id
      ORDER BY LPAD(f.penpal_code, 4, '0') ASC NULLS LAST
    `);

  return result.rows;
}
