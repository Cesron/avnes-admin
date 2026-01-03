import { sql } from "@/lib/sql";

export type FamilyOption = {
  id: string;
  penpal_code: string;
};

export async function getFamiliesOptions(): Promise<FamilyOption[]> {
  const result = await sql.query<FamilyOption>(`
    SELECT id, penpal_code
    FROM families
    ORDER BY penpal_code ASC
  `);

  return result.rows;
}
