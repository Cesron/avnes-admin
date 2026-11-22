import type { Child } from "@/types/child";

export type ChildRecord = Pick<
  Child,
  "id" | "name" | "gender" | "child_photo_url" | "pamphlet_url" | "notes"
> & {
  birth_date: string;
  created_on: string;
  updated_on: string;
  groups: { id: string; name: string; club_name: string }[];
};

// The caller supplies the static child alias and, for mentors, a user ID parameter.
export function activeChildGroups(childAlias: string, mentorUserId?: string) {
  return `SELECT COALESCE(json_agg(
    json_build_object('id', g.id, 'name', g.name, 'club_name', cl.name)
    ORDER BY cl.name, g.name, g.id
  ), '[]'::json) AS groups
  FROM children_groups cg
  JOIN groups g ON g.id = cg.group_id
  JOIN clubs cl ON cl.id = g.club_id
  ${mentorUserId ? "JOIN mentors m ON m.id = g.mentor_id" : ""}
  WHERE cg.child_id = ${childAlias}.id AND cg.active = true
    ${mentorUserId ? `AND m.user_id = ${mentorUserId}` : ""}`;
}

export function childHasNoActiveGroup(childAlias: string) {
  return `NOT EXISTS (
    SELECT 1 FROM children_groups cg
    WHERE cg.child_id = ${childAlias}.id AND cg.active = true
  )`;
}
