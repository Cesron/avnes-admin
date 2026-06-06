import { sql } from "@/lib/sql";

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

type GetFamiliesParams = {
  search?: string;
};

type FamilyRow = Omit<FamilyWithChildren, "children"> & {
  // PostgreSQL devuelve el `json_agg` como string por defecto.
  children: string | ChildSummary[];
};

/**
 * Parsea el valor de la columna `children` que viene del SQL.
 * El driver `pg` devuelve los `json` como string, pero lo dejamos
 * tolerante por si en algún momento se configura el auto-parseo.
 */
function parseChildren(value: string | ChildSummary[]): ChildSummary[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || value.length === 0) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as ChildSummary[]) : [];
  } catch {
    return [];
  }
}

export async function getFamilies(
  params?: GetFamiliesParams,
): Promise<FamilyWithChildren[]> {
  const { search } = params ?? {};

  const searchCondition = search
    ? `WHERE LOWER(penpal_code) LIKE $1
       OR LOWER(COALESCE(children_names, '')) LIKE $1`
    : "";

  const queryParams: string[] = search ? [`%${search.toLowerCase()}%`] : [];

  const result = await sql.query<FamilyRow>(
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
        STRING_AGG(c.name, ', ' ORDER BY c.name) as children_names,
        MIN(c.name) as first_child_name
      FROM families f
      LEFT JOIN children c ON f.id = c.family_id
      GROUP BY f.id, f.penpal_code, f.family_biography_url, f.family_photo_url, f.created_at, f.updated_at
    )
    SELECT
      fa.*,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'photo_url', c.child_photo_url,
              'gender', c.gender
            ) ORDER BY c.name
          )
          FROM children c
          WHERE c.family_id = fa.id
        ),
        '[]'::json
      ) as children
    FROM families_aggregated fa
    ${searchCondition}
    ORDER BY LPAD(penpal_code, 4, '0') ASC
  `,
    queryParams,
  );

  return result.rows.map((row) => ({
    ...row,
    children: parseChildren(row.children),
  }));
}
