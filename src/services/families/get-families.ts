import {
  makePage,
  PAGE_SIZE,
  type PageRequest,
  type PageResult,
  readCursor,
} from "@/lib/pagination";
import { searchColumn, searchPattern } from "@/lib/search";
import { sql } from "@/lib/sql";
import { mentorChildAccess, mentorFamilyAccess } from "./family-access";

/**
 * Resumen de un niño pensado para mostrar en listas (cards de familia, etc).
 * Es más liviano que el tipo `Child` completo: sólo lo que se renderiza.
 */
export type ChildSummary = {
  id: string;
  name: string;
  photo_url: string | null;
  gender: string;
};

export type FamilyWithChildren = {
  id: string;
  penpal_code: string;
  family_biography_url: string | null;
  family_photo_url: string | null;
  created_at: Date;
  updated_at: Date;
  children_count: number;
  children_names: string | null;
  /**
   * Nombre completo del primer niño de la familia (orden alfabético).
   * Se usa para derivar los apellidos de la familia y las iniciales
   * del avatar fallback. `null` cuando la familia no tiene niños.
   */
  first_child_name: string | null;
  /**
   * Lista estructurada de los niños de la familia, ordenada
   * alfabéticamente. Vacía cuando la familia no tiene niños.
   */
  children: ChildSummary[];
};

type GetFamiliesParams = PageRequest & {
  search?: string;
  /** Authenticated user ID, supplied by the server for mentors. */
  mentorUserId?: string;
};

export async function getFamilies(
  params: GetFamiliesParams = {},
): Promise<PageResult<FamilyWithChildren>> {
  const cursor = readCursor(params);
  const backwards = cursor?.backwards ?? false;
  const values: (string | number)[] = [];
  const conditions: string[] = [];
  let childAccess: string | undefined;
  if (params.mentorUserId !== undefined) {
    values.push(params.mentorUserId);
    const userIdParameter = `$${values.length}`;
    conditions.push(mentorFamilyAccess("f", userIdParameter));
    childAccess = mentorChildAccess("c", userIdParameter);
  }
  if (params.search?.trim()) {
    values.push(searchPattern(params.search));
    conditions.push(`(${searchColumn("f.penpal_code")} LIKE $${values.length} OR EXISTS (
      SELECT 1 FROM children c WHERE c.family_id = f.id
      AND ${searchColumn("c.name")} LIKE $${values.length}
      ${childAccess ? `AND ${childAccess}` : ""}
    ))`);
  }
  if (cursor) {
    values.push(cursor.key, cursor.id);
    conditions.push(`(LPAD(f.penpal_code, 4, '0'), f.id) ${backwards ? "<" : ">"}
      ($${values.length - 1}::text, $${values.length}::uuid)`);
  }
  values.push(PAGE_SIZE + 1);
  const direction = backwards ? "DESC" : "ASC";
  const result = await sql.query<FamilyWithChildren & { penpal_sort: string }>(
    `
    WITH page AS MATERIALIZED (
      SELECT f.*, LPAD(f.penpal_code, 4, '0') AS penpal_sort
      FROM families f
      ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
      ORDER BY LPAD(f.penpal_code, 4, '0') ${direction}, f.id ${direction}
      LIMIT $${values.length}
    )
    SELECT page.*, details.* FROM page
    CROSS JOIN LATERAL (
      SELECT COUNT(c.id)::int AS children_count,
        STRING_AGG(c.name, ', ' ORDER BY c.name, c.id) AS children_names,
        MIN(c.name) AS first_child_name,
        COALESCE(json_agg(json_build_object(
          'id', c.id, 'name', c.name, 'photo_url', c.child_photo_url, 'gender', c.gender
        ) ORDER BY c.name, c.id), '[]'::json) AS children
      FROM children c WHERE c.family_id = page.id
        ${childAccess ? `AND ${childAccess}` : ""}
    ) details
    ORDER BY page.penpal_sort ${direction}, page.id ${direction}
  `,
    values,
  );
  return makePage(result.rows, cursor);
}
