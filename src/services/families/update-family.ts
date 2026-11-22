import type { SessionUserInfo } from "@/lib/auth-utils";
import { sql } from "@/lib/sql";
import type { Family } from "@/types/family";
import { CustomError } from "@/utils/custom-error";
import { mentorFamilyAccess } from "./family-access";

type UpdateFamilyParams = {
  id: string;
  penpalCode: string;
  familyBiographyUrl?: string;
  familyPhotoUrl?: string;
  history?: string;
};

type UpdatedFamily = Pick<
  Family,
  "id" | "penpal_code" | "family_biography_url" | "family_photo_url" | "history"
>;

export async function updateFamily(
  {
    id,
    penpalCode,
    familyBiographyUrl,
    familyPhotoUrl,
    history,
  }: UpdateFamilyParams,
  user: Pick<SessionUserInfo, "userId" | "role">,
): Promise<UpdatedFamily> {
  if (!["admin", "coordinator", "mentor"].includes(user.role ?? "")) {
    throw CustomError.forbidden("No tienes permisos para editar familias.");
  }

  const family = await sql.query<{ id: string; penpal_code: string }>(
    `SELECT f.id, f.penpal_code FROM families f WHERE f.id = $1 AND (
      $2::text IN ('admin', 'coordinator') OR
      ($2::text = 'mentor' AND ${mentorFamilyAccess("f", "$3")})
    )`,
    [id, user.role, user.userId],
  );

  if (!family.rows[0]) {
    if (user.role === "mentor") {
      throw CustomError.forbidden(
        "No tienes permisos para editar esta familia.",
      );
    }
    throw CustomError.notFound("La familia no existe");
  }

  if (user.role === "mentor") {
    if (penpalCode !== family.rows[0].penpal_code) {
      throw CustomError.forbidden(
        "No tienes permisos para cambiar el código penpal.",
      );
    }
  } else {
    const existingFamily = await sql.query(
      "SELECT id FROM families WHERE penpal_code = $1 AND id != $2",
      [penpalCode, id],
    );
    if (existingFamily.rows.length > 0) {
      throw CustomError.badRequest(
        `Ya existe otra familia con el código penpal "${penpalCode}"`,
      );
    }
  }

  // Recheck membership in the write itself; a stale dialog grants no access.
  // Preserve the stored code for mentors even if a request is tampered with.
  const result = await sql.query<UpdatedFamily>(
    `UPDATE families AS f
     SET penpal_code = CASE WHEN $5::text = 'mentor' THEN f.penpal_code ELSE $1 END,
         family_biography_url = $2, family_photo_url = $3,
         history = CASE WHEN $7::text IS NULL THEN f.history ELSE NULLIF($7, '') END,
         updated_at = NOW()
     WHERE f.id = $4 AND (
       $5::text IN ('admin', 'coordinator') OR
       ($5::text = 'mentor' AND ${mentorFamilyAccess("f", "$6")})
     ) AND ($5::text <> 'mentor' OR f.penpal_code = $1)
     RETURNING f.id, f.penpal_code, f.family_biography_url, f.family_photo_url, f.history`,
    [
      penpalCode,
      familyBiographyUrl || null,
      familyPhotoUrl || null,
      id,
      user.role,
      user.userId,
      history?.trim() ?? null,
    ],
  );

  if (!result.rows[0]) {
    throw CustomError.forbidden(
      "La familia cambió o ya no tienes acceso a ella. Vuelve a abrir la ficha.",
    );
  }

  return result.rows[0];
}
