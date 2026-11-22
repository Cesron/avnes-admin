"use server";

import { revalidatePath } from "next/cache";
import { authorize } from "@/lib/auth-utils";
import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { createFamilySchema } from "./create-family.schema";

export const createFamilyAction = actionClient
  .inputSchema(createFamilySchema)
  .action(
    async ({
      parsedInput: { penpalCode, familyBiographyUrl, familyPhotoUrl, history },
    }) => {
      const { user } = await authorize("/families");
      if (user.role !== "admin" && user.role !== "coordinator") {
        throw CustomError.forbidden("No tienes permisos para crear familias.");
      }

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
        `INSERT INTO families (penpal_code, family_biography_url, family_photo_url, history)
         VALUES ($1, $2, $3, $4)`,
        [
          penpalCode,
          familyBiographyUrl || null,
          familyPhotoUrl || null,
          history?.trim() || null,
        ],
      );

      // Revalidar la página para mostrar los cambios
      revalidatePath("/families");
    },
  );
