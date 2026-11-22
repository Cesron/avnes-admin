"use server";

import { revalidatePath } from "next/cache";
import { authorize } from "@/lib/auth-utils";
import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { mentorFamilyAccess } from "@/services/families/family-access";
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

      // Crear el nuevo niño/niña
      await sql.query(
        `INSERT INTO children (name, gender, birth_date, family_id, pamphlet_url, child_photo_url, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          trimmedName,
          gender,
          birthDate,
          familyId || null,
          pamphletUrl || null,
          childPhotoUrl || null,
          notes?.trim() || null,
        ],
      );
      revalidatePath("/children");
      revalidatePath("/families");
      if (familyId) {
        revalidatePath(`/families/${familyId}`);
        revalidatePath("/children/[childId]", "page");
      }
    },
  );
