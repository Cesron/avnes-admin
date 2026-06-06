"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
import { createFamilySchema } from "./create-family.schema";

export const createFamilyAction = actionClient
  .inputSchema(createFamilySchema)
  .action(
    async ({
      parsedInput: { penpalCode, familyBiographyUrl, familyPhotoUrl },
    }) => {
      // Verificar si ya existe una familia con el mismo código penpal
      const existingFamily = await sql.query(
        `SELECT id FROM families WHERE penpal_code = $1`,
        [penpalCode],
      );

      if (existingFamily.rows.length > 0) {
        throw CustomError.badRequest(
          `Ya existe una familia con el código penpal "${penpalCode}"`,
        );
      }

      // Crear la nueva familia
      await sql.query(
        `INSERT INTO families (penpal_code, family_biography_url, family_photo_url) 
         VALUES ($1, $2, $3) 
         RETURNING id, penpal_code, family_biography_url, family_photo_url`,
        [penpalCode, familyBiographyUrl || null, familyPhotoUrl || null],
      );

      // Revalidar la página para mostrar los cambios
      revalidatePath("/families");
    },
  );
