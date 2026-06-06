"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { createChildSchema } from "./create-child.schema";

export const createChildAction = actionClient
  .inputSchema(createChildSchema)
  .action(
    async ({
      parsedInput: {
        familyId,
        name,
        gender,
        birthDate,
        pamphletUrl,
        childPhotoUrl,
      },
    }) => {
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

      // Crear el nuevo niño/niña
      await sql.query(
        `INSERT INTO children (name, gender, birth_date, family_id, pamphlet_url, child_photo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          trimmedName,
          gender,
          birthDate,
          familyId || null,
          pamphletUrl || null,
          childPhotoUrl || null,
        ],
      );
    },
  );
