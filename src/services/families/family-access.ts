// Callers supply only static SQL aliases and parameter placeholders.
export function mentorChildAccess(childAlias: string, userIdParameter: string) {
  return `EXISTS (
    SELECT 1 FROM children_groups cg
    JOIN groups g ON g.id = cg.group_id
    JOIN mentors m ON m.id = g.mentor_id
    WHERE cg.child_id = ${childAlias}.id AND cg.active = true
      AND m.user_id = ${userIdParameter}
  )`;
}

export function mentorFamilyAccess(
  familyAlias: string,
  userIdParameter: string,
) {
  return `EXISTS (
    SELECT 1 FROM children member_child
    WHERE member_child.family_id = ${familyAlias}.id
      AND ${mentorChildAccess("member_child", userIdParameter)}
  )`;
}
