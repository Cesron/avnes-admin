"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
import { editFamilySchema } from "./edit-family.schema";

export const editFamilyAction = actionClient
  .inputSchema(editFamilySchema)
  .action(
    async ({
      parsedInput: { id, penpalCode, familyBiographyUrl, familyPhotoUrl },
    }) => {
      // Verificar si la familia existe
      const familyExists = await sql.query(
        `SELECT id FROM families WHERE id = $1`,
        [id],
      );

      if (familyExists.rows.length === 0) {
        throw CustomError.notFound("La familia no existe");
      }

      // Verificar si ya existe otra familia con el mismo código penpal
      const existingFamily = await sql.query(
        `SELECT id FROM families WHERE penpal_code = $1 AND id != $2`,
        [penpalCode, id],
      );

      if (existingFamily.rows.length > 0) {
        throw CustomError.badRequest(
          `Ya existe otra familia con el código penpal "${penpalCode}"`,
        );
      }

      // Actualizar la familia
      const result = await sql.query(
        `UPDATE families 
         SET penpal_code = $1, family_biography_url = $2, family_photo_url = $3, updated_at = NOW() 
         WHERE id = $4 
         RETURNING id, penpal_code, family_biography_url, family_photo_url`,
        [penpalCode, familyBiographyUrl || null, familyPhotoUrl || null, id],
      );

      // Revalidar la página para mostrar los cambios
      revalidatePath("/families");

      return {
        family: result.rows[0],
      };
    },
  );
