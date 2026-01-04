import { sql } from "@/lib/sql";

export type FamilyWithChildren = {
  id: string;
  penpal_code: string;
  family_biography_url: string | null;
  family_photo_url: string | null;
  created_at: Date;
  updated_at: Date;
  children_count: number;
  children_names: string | null;
};

export async function getFamilies(): Promise<FamilyWithChildren[]> {
  const result = await sql.query<FamilyWithChildren>(`
    SELECT 
      f.id,
      f.penpal_code,
      f.family_biography_url,
      f.family_photo_url,
      f.created_at,
      f.updated_at,
      COUNT(c.id)::int as children_count,
      STRING_AGG(c.name, ', ' ORDER BY c.name) as children_names
    FROM families f
    LEFT JOIN children c ON f.id = c.family_id
    GROUP BY f.id, f.penpal_code, f.family_biography_url, f.family_photo_url, f.created_at, f.updated_at
    ORDER BY LPAD(f.penpal_code, 4, '0') ASC
  `);

  return result.rows;
}
