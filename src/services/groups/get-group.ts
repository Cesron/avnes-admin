import { sql } from "@/lib/sql";
import type { Group } from "@/types/group";

export type GroupDetail = Group & { children_count: number };

export async function getGroup(groupId: string): Promise<GroupDetail | null> {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      groupId,
    )
  )
    return null;

  const result = await sql.query<GroupDetail>(
    `SELECT g.id, g.name, g.club_id, g.mentor_id,
      c.name AS club_name, m.name AS mentor_name,
      (SELECT COUNT(DISTINCT cg.child_id)::int FROM children_groups cg
       WHERE cg.group_id = g.id AND cg.active = true) AS children_count
     FROM groups g
     JOIN clubs c ON c.id = g.club_id
     JOIN mentors m ON m.id = g.mentor_id
     WHERE g.id = $1::uuid`,
    [groupId],
  );
  return result.rows[0] ?? null;
}
