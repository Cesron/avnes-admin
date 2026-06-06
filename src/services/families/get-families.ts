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

type GetFamiliesParams = {
  search?: string;
};

export async function getFamilies(
  params?: GetFamiliesParams,
): Promise<FamilyWithChildren[]> {
  const { search } = params ?? {};

  const searchCondition = search
    ? `WHERE LOWER(penpal_code) LIKE $1
       OR LOWER(COALESCE(children_names, '')) LIKE $1`
    : "";

  const queryParams: string[] = search ? [`%${search.toLowerCase()}%`] : [];

  const result = await sql.query<FamilyWithChildren>(
    `
    WITH families_aggregated AS (
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
    )
    SELECT *
    FROM families_aggregated
    ${searchCondition}
    ORDER BY LPAD(penpal_code, 4, '0') ASC
  `,
    queryParams,
  );

  return result.rows;
}
