import { sql } from "@/lib/sql";

export async function getNextPenpalCode(): Promise<string> {
  const result = await sql.query<{ max_code: string | null }>(`
    SELECT MAX(penpal_code) as max_code FROM families
  `);

  const maxCode = result.rows[0]?.max_code;

  if (!maxCode) {
    return "0001";
  }

  const nextNumber = parseInt(maxCode, 10) + 1;
  return nextNumber.toString().padStart(4, "0");
}
