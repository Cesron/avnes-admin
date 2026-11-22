import type { SessionUserInfo } from "@/lib/auth-utils";
import { sql } from "@/lib/sql";
import { mentorChildAccess } from "@/services/families/family-access";
import type { Family } from "@/types/family";
import {
  activeChildGroups,
  type ChildRecord,
  childHasNoActiveGroup,
} from "./child-record";

type ProfileFamily = Pick<
  Family,
  "id" | "penpal_code" | "family_photo_url" | "family_biography_url" | "history"
> & { other_children: Pick<ChildRecord, "id" | "name">[] };

export type ChildProfile = ChildRecord & {
  can_view_private_details: boolean;
  family: ProfileFamily | null;
};

export async function getChildProfile(
  childId: string,
  user: Pick<SessionUserInfo, "userId" | "role">,
): Promise<ChildProfile | null> {
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(childId)) {
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
  const canViewPrivate = isMentor
    ? "json_array_length(memberships.groups) > 0"
    : "true";
  const result = await sql.query<ChildProfile>(
    `
    SELECT c.id, c.name, c.gender, c.child_photo_url, c.pamphlet_url,
      to_char(c.birth_date, 'YYYY-MM-DD') AS birth_date,
      to_char(c.created_at, 'YYYY-MM-DD') AS created_on,
      to_char(c.updated_at, 'YYYY-MM-DD') AS updated_on,
      memberships.groups,
      ${canViewPrivate} AS can_view_private_details,
      CASE WHEN ${canViewPrivate} THEN c.notes END AS notes,
      CASE WHEN f.id IS NOT NULL THEN json_build_object(
        'id', f.id,
        'penpal_code', f.penpal_code,
        'family_photo_url', f.family_photo_url,
        'family_biography_url', f.family_biography_url,
        'history', f.history,
        'other_children', COALESCE((
          SELECT json_agg(json_build_object('id', sibling.id, 'name', sibling.name)
            ORDER BY sibling.name, sibling.id)
          FROM children sibling
          WHERE sibling.family_id = f.id AND sibling.id <> c.id
            ${isMentor ? `AND ${mentorChildAccess("sibling", "$2")}` : ""}
        ), '[]'::json)
      ) END AS family
    FROM children c
    CROSS JOIN LATERAL (
      ${activeChildGroups("c", isMentor ? "$2" : undefined)}
    ) memberships
    LEFT JOIN families f ON f.id = c.family_id AND ${canViewPrivate}
    WHERE c.id = $1
      ${isMentor ? `AND (${canViewPrivate} OR ${childHasNoActiveGroup("c")})` : ""}
    `,
    isMentor ? [childId, user.userId] : [childId],
  );
  return result.rows[0] ?? null;
}
