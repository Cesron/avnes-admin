"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
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
      const trimmedName = name.trim();

      // Verificar si el niño existe
      const childExists = await sql.query(
        `SELECT id FROM children WHERE id = $1`,
        [id],
      );

      if (childExists.rows.length === 0) {
        throw CustomError.notFound("El niño/niña no existe");
      }

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

      // Actualizar el niño
      const result = await sql.query(
        `UPDATE children SET name = $1, gender = $2, birth_date = $3, family_id = $4, pamphlet_url = $5, child_photo_url = $6, updated_at = NOW() WHERE id = $7 RETURNING id`,
        [
          trimmedName,
          gender,
          birthDate,
          familyId || null,
          pamphletUrl || null,
          childPhotoUrl || null,
          id,
        ],
      );

      // Revalidar la página para mostrar los cambios
      revalidatePath("/children");

      return {
        child: result.rows[0],
      };
    },
  );
