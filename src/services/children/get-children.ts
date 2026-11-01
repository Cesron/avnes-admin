import {
  makePage,
  PAGE_SIZE,
  type PageRequest,
  type PageResult,
  readCursor,
} from "@/lib/pagination";
import { sql } from "@/lib/sql";
import type { Child } from "@/types/child";

export type ChildWithFamily = Child & {
  penpal_code: string | null;
  family_biography_url: string | null;
  family_photo_url: string | null;
  /** Active group assigned to the child (null when the child is not in any group). */
  group_id: string | null;
  group_name: string | null;
  group_club_name: string | null;
};

type GetChildrenParams = PageRequest & {
  clubId?: string;
  groupId?: string;
  search?: string;
  mentorGroupIds?: string[];
};

export async function getChildren(
  params: GetChildrenParams = {},
): Promise<PageResult<ChildWithFamily>> {
  const cursor = readCursor(params);
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (
    [params.clubId, params.groupId].some((value) => value && !uuid.test(value))
  ) {
    return { items: [], previous: null, next: null };
  }
  const backwards = cursor?.backwards ?? false;
  const values: (string | string[] | number)[] = [];
  const conditions: string[] = [];
  const groupConditions: string[] = [];
  if (params.clubId) {
    values.push(params.clubId);
    groupConditions.push(`g.club_id = $${values.length}::uuid`);
  }
  if (params.groupId) {
    values.push(params.groupId);
    groupConditions.push(`g.id = $${values.length}::uuid`);
  }
  if (params.mentorGroupIds !== undefined) {
    values.push(params.mentorGroupIds);
    groupConditions.push(`g.id = ANY($${values.length}::uuid[])`);
  }
  if (groupConditions.length)
    conditions.push("membership.group_id IS NOT NULL");
  if (params.search?.trim()) {
    values.push(`%${params.search.trim().toLowerCase()}%`);
    conditions.push(`LOWER(c.name) LIKE $${values.length}`);
  }
  if (cursor) {
    values.push(cursor.key, cursor.id);
    conditions.push(`(COALESCE(LPAD(f.penpal_code, 4, '0'), '99999'), c.id) ${backwards ? "<" : ">"}
      ($${values.length - 1}::text, $${values.length}::uuid)`);
  }
  values.push(PAGE_SIZE + 1);
  const direction = backwards ? "DESC" : "ASC";
  const result = await sql.query<ChildWithFamily & { penpal_sort: string }>(
    `
    SELECT c.*, f.penpal_code, f.family_biography_url, f.family_photo_url,
      membership.*, COALESCE(LPAD(f.penpal_code, 4, '0'), '99999') AS penpal_sort
    FROM children c
    LEFT JOIN families f ON f.id = c.family_id
    LEFT JOIN LATERAL (
      SELECT g.id AS group_id, g.name AS group_name, cl.name AS group_club_name
      FROM children_groups cg
      JOIN groups g ON g.id = cg.group_id
      JOIN clubs cl ON cl.id = g.club_id
      WHERE cg.child_id = c.id AND cg.active = true
        ${groupConditions.length ? `AND ${groupConditions.join(" AND ")}` : ""}
      ORDER BY g.name, g.id LIMIT 1
    ) membership ON true
    ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
    ORDER BY COALESCE(LPAD(f.penpal_code, 4, '0'), '99999') ${direction}, c.id ${direction}
    LIMIT $${values.length}
  `,
    values,
  );
  return makePage(result.rows, cursor);
}
