import { sql } from "@/lib/sql";
import type { Child } from "@/types/child";

export type ChildWithFamily = Child & {
  penpal_code: string | null;
  family_biography_url: string | null;
  family_photo_url: string | null;
};

type GetChildrenParams = {
  clubId?: string;
  groupId?: string;
  search?: string;
  /** When set, only children belonging to these group IDs are returned (role-based filter) */
  mentorGroupIds?: string[];
};

export async function getChildren(
  params?: GetChildrenParams,
): Promise<ChildWithFamily[]> {
  const { clubId, groupId, search, mentorGroupIds } = params ?? {};

  let clubCondition = "";
  let groupCondition = "";
  let mentorGroupCondition = "";
  let searchCondition = "";
  const queryParams: (string | string[])[] = [];
  let paramIndex = 1;

  // We need the JOIN when any group/club filter is active
  const needsGroupJoin = !!(
    clubId ||
    groupId ||
    (mentorGroupIds && mentorGroupIds.length > 0)
  );

  if (clubId) {
    clubCondition = `AND cl.id = $${paramIndex}`;
    queryParams.push(clubId);
    paramIndex++;
  }

  if (groupId) {
    groupCondition = `AND g.id = $${paramIndex}`;
    queryParams.push(groupId);
    paramIndex++;
  }

  if (mentorGroupIds && mentorGroupIds.length > 0) {
    const placeholders = mentorGroupIds
      .map((_, i) => `$${paramIndex + i}`)
      .join(", ");
    mentorGroupCondition = `AND g.id IN (${placeholders})`;
    for (const id of mentorGroupIds) {
      queryParams.push(id);
    }
    paramIndex += mentorGroupIds.length;
  }

  if (search) {
    searchCondition = `AND LOWER(c.name) LIKE $${paramIndex}`;
    queryParams.push(`%${search.toLowerCase()}%`);
    paramIndex++;
  }

  const groupJoin = needsGroupJoin
    ? `INNER JOIN children_groups cg ON cg.child_id = c.id AND cg.active = true
       INNER JOIN groups g ON g.id = cg.group_id
       INNER JOIN clubs cl ON cl.id = g.club_id`
    : "";

  const result = await sql.query<ChildWithFamily>(
    `
      SELECT DISTINCT
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
        f.family_photo_url,
        LPAD(f.penpal_code, 4, '0') as penpal_sort
      FROM children c
      LEFT JOIN families f ON c.family_id = f.id
      ${groupJoin}
      WHERE 1=1
        ${clubCondition}
        ${groupCondition}
        ${mentorGroupCondition}
        ${searchCondition}
      ORDER BY penpal_sort ASC NULLS LAST
    `,
    queryParams,
  );

  return result.rows;
}
