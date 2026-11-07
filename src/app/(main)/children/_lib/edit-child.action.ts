"use server";

import { revalidatePath } from "next/cache";
import { authorize } from "@/lib/auth-utils";
import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { editChildSchema } from "./edit-child.schema";

export const editChildAction = actionClient
  .inputSchema(editChildSchema)
  .action(
    async ({
      parsedInput: {
        id,
        familyId,
        name,
        gender,
        birthDate,
        pamphletUrl,
        childPhotoUrl,
      },
    }) => {
      const { user } = await authorize("/children");
      const trimmedName = name.trim();

      // Verificar que la familia existe (solo si se proporciona)
      if (familyId) {
        const familyExists = await sql.query(
          `SELECT id FROM families WHERE id = $1`,
          [familyId],
        );

        if (familyExists.rows.length === 0) {
          throw CustomError.badRequest("La familia seleccionada no existe");
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

      // Comprobar la membresía activa en la misma consulta que guarda los cambios.
      const result = await sql.query<{ id: string }>(
        `UPDATE children AS c
         SET name = $1, gender = $2, birth_date = $3, family_id = $4,
             pamphlet_url = $5, child_photo_url = $6, updated_at = NOW()
         WHERE c.id = $7 AND (
           $8::text IN ('admin', 'coordinator') OR ($8::text = 'mentor' AND EXISTS (
             SELECT 1 FROM children_groups cg
             JOIN groups g ON g.id = cg.group_id
             JOIN mentors m ON m.id = g.mentor_id
             WHERE cg.child_id = c.id AND cg.active = true AND m.user_id = $9
           ))
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
        ],
      );

      const child = result.rows[0];
      if (!child) {
        if (user.role === "mentor") {
          throw CustomError.forbidden(
            "No tienes permisos para editar a este niño o niña.",
          );
        }

        throw CustomError.notFound("El niño/niña no existe");
      }

      // Revalidar la página para mostrar los cambios
      revalidatePath("/children");

      return { child };
    },
  );
