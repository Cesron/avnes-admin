import { sql } from "@/lib/sql";
import { mentorFamilyAccess } from "./family-access";

export type FamilyOption = {
  id: string;
  penpal_code: string;
};

export async function getFamiliesOptions(
  mentorUserId?: string,
): Promise<FamilyOption[]> {
  const result = await sql.query<FamilyOption>(
    `
    SELECT f.id, f.penpal_code
    FROM families f
    ${mentorUserId !== undefined ? `WHERE ${mentorFamilyAccess("f", "$1")}` : ""}
    ORDER BY f.penpal_code ASC
  `,
    mentorUserId !== undefined ? [mentorUserId] : [],
  );

  return result.rows;
}
