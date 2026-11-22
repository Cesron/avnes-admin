import type { SessionUserInfo } from "@/lib/auth-utils";
import { sql } from "@/lib/sql";
import type { Family } from "@/types/family";
import { activeChildGroups, type ChildRecord } from "../children/child-record";
import { mentorChildAccess } from "./family-access";

export type FamilyDetail = Family & { children: ChildRecord[] };

export async function getFamilyDetail(
  familyId: string,
  user: Pick<SessionUserInfo, "userId" | "role">,
): Promise<FamilyDetail | null> {
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(familyId)) {
    return null;
  }
  if (
    user.role !== "admin" &&
    user.role !== "coordinator" &&
    user.role !== "mentor"
  ) {
    return null;
  }

  const isMentor = user.role === "mentor";
  const result = await sql.query<FamilyDetail>(
    `
    SELECT f.*, COALESCE(visible.children, '[]'::json) AS children
    FROM families f
    CROSS JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id', c.id,
          'name', c.name,
          'gender', c.gender,
          'birth_date', to_char(c.birth_date, 'YYYY-MM-DD'),
          'created_on', to_char(c.created_at, 'YYYY-MM-DD'),
          'updated_on', to_char(c.updated_at, 'YYYY-MM-DD'),
          'child_photo_url', c.child_photo_url,
          'pamphlet_url', c.pamphlet_url,
          'notes', c.notes,
          'groups', memberships.groups
        ) ORDER BY c.name, c.id
      ) AS children
      FROM children c
      CROSS JOIN LATERAL (
        ${activeChildGroups("c", isMentor ? "$2" : undefined)}
      ) memberships
      WHERE c.family_id = f.id
        ${isMentor ? `AND ${mentorChildAccess("c", "$2")}` : ""}
    ) visible
    WHERE f.id = $1 ${isMentor ? "AND visible.children IS NOT NULL" : ""}
    `,
    isMentor ? [familyId, user.userId] : [familyId],
  );
  return result.rows[0] ?? null;
}
