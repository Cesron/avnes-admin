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
        firstName,
        lastName,
        gender,
        birthDate,
        pamphletUrl,
        childPhotoUrl,
      },
    }) => {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      // Verificar que la familia existe
      const familyExists = await sql.query(
        `SELECT id FROM families WHERE id = $1`,
        [familyId]
      );

      if (familyExists.rows.length === 0) {
        throw CustomError.badRequest("La familia seleccionada no existe");
      }

      // Crear el nuevo niño/niña
      await sql.query(
        `INSERT INTO children (first_name, last_name, gender, birth_date, family_id, pamphlet_url, child_photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          trimmedFirstName,
          trimmedLastName,
          gender,
          birthDate,
          familyId,
          pamphletUrl || null,
          childPhotoUrl || null,
        ]
      );
    }
  );
