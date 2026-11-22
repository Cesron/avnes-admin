"use server";

import { revalidatePath } from "next/cache";
import { authorize } from "@/lib/auth-utils";
import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import {
  mentorChildAccess,
  mentorFamilyAccess,
} from "@/services/families/family-access";
import { CustomError } from "@/utils/custom-error";
import { editChildSchema } from "./edit-child.schema";

export const editChildAction = actionClient
  .inputSchema(editChildSchema)
  .action(
    async ({
      parsedInput: {
        id,
        familyId,
        groupId,
        previousGroupId,
        name,
        gender,
        birthDate,
        pamphletUrl,
        childPhotoUrl,
        notes,
      },
    }) => {
      const { user } = await authorize("/children");
      const trimmedName = name.trim();

      // Verificar que la familia existe (solo si se proporciona)
      if (familyId) {
        const familyExists = await sql.query(
          `SELECT f.id FROM families f WHERE f.id = $1 AND (
            $2::text IN ('admin', 'coordinator') OR
            ($2::text = 'mentor' AND ${mentorFamilyAccess("f", "$3")})
          )`,
          [familyId, user.role, user.id],
        );

        if (familyExists.rows.length === 0) {
          throw CustomError.badRequest(
            "La familia seleccionada no existe o no tienes acceso a ella",
          );
        }
      }

      // Validar que la fecha de nacimiento no sea futura
      const birthDateObj = new Date(birthDate);
      const today = new Date();

      if (birthDateObj > today) {
        throw CustomError.badRequest(
          "La fecha de nacimiento no puede ser futura",
        );
      }

      const changingGroup =
        groupId !== undefined && groupId !== previousGroupId;
      const client = await sql.connect();
      let child: { id: string };

      try {
        await client.query("BEGIN");
        // Serializar las ediciones de la ficha antes de comprobar sus permisos.
        await client.query("SELECT id FROM children WHERE id = $1 FOR UPDATE", [
          id,
        ]);

        const result = await client.query<{ id: string }>(
          `UPDATE children AS c
         SET name = $1, gender = $2, birth_date = $3, family_id = $4,
             pamphlet_url = $5, child_photo_url = $6,
             notes = CASE WHEN $10::text IS NULL THEN c.notes ELSE NULLIF($10, '') END,
             updated_at = NOW()
         WHERE c.id = $7 AND (
           $8::text IN ('admin', 'coordinator') OR (
             $8::text = 'mentor' AND ${mentorChildAccess("c", "$9")}
             AND ($4::uuid IS NULL OR EXISTS (
               SELECT 1 FROM families f
               WHERE f.id = $4 AND ${mentorFamilyAccess("f", "$9")}
             ))
           )
         )
         RETURNING c.id`,
          [
            trimmedName,
            gender,
            birthDate,
            familyId || null,
            pamphletUrl || null,
            childPhotoUrl || null,
            id,
            user.role,
            user.id,
            notes?.trim() ?? null,
          ],
        );

        child = result.rows[0];
        if (!child) {
          if (user.role === "mentor") {
            throw CustomError.forbidden(
              "No tienes permisos para editar a este niño o niña.",
            );
          }

          throw CustomError.notFound("El niño/niña no existe");
        }

        if (changingGroup) {
          const targetGroup = await client.query(
            "SELECT id FROM groups WHERE id = $1",
            [groupId],
          );
          if (!targetGroup.rows[0]) {
            throw CustomError.badRequest("El grupo seleccionado no existe");
          }

          if (previousGroupId) {
            // Cambiar solo la membresía mostrada en la ficha, conservando las demás.
            const previousMembership = await client.query(
              `UPDATE children_groups AS cg SET active = false
               WHERE cg.child_id = $1 AND cg.group_id = $2 AND cg.active = true
                 AND ($3::text IN ('admin', 'coordinator') OR
                   ($3::text = 'mentor' AND EXISTS (
                     SELECT 1 FROM groups g JOIN mentors m ON m.id = g.mentor_id
                     WHERE g.id = cg.group_id AND m.user_id = $4
                   )))
               RETURNING cg.group_id`,
              [id, previousGroupId, user.role, user.id],
            );
            if (!previousMembership.rows[0]) {
              throw CustomError.conflict(
                "El grupo actual cambió o no tienes permisos para trasladarlo. Vuelve a abrir la ficha.",
              );
            }
          } else {
            const membership = await client.query(
              "SELECT group_id FROM children_groups WHERE child_id = $1 AND active = true LIMIT 1",
              [id],
            );
            if (membership.rows[0]) {
              throw CustomError.conflict(
                "El niño o niña ya tiene un grupo asignado. Vuelve a abrir la ficha.",
              );
            }
          }

          await client.query(
            `INSERT INTO children_groups (child_id, group_id, active)
             VALUES ($1, $2, true)
             ON CONFLICT (child_id, group_id) DO UPDATE SET active = true`,
            [id, groupId],
          );
        }

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      // Revalidar la página para mostrar los cambios
      revalidatePath("/children");
      revalidatePath("/children/[childId]", "page");
      revalidatePath("/families");
      revalidatePath("/families/[familyId]", "page");
      revalidatePath("/groups/[groupId]", "page");
      if (changingGroup) {
        revalidatePath("/groups");
        revalidatePath("/dashboard");
        revalidatePath("/attendance", "layout");
      }

      return { child };
    },
  );
