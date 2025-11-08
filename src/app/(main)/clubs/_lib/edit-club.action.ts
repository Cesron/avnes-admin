"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { normalizeString } from "@/utils/normalize-string";
import { revalidatePath } from "next/cache";
import { editClubSchema } from "./edit-club.schema";

export const editClubAction = actionClient
  .inputSchema(editClubSchema)
  .action(async ({ parsedInput: { id, name } }) => {
    const trimmedName = name.trim();
    const normalizedName = normalizeString(trimmedName);

    // Verificar si el club existe
    const clubExists = await sql.query(`SELECT id FROM clubs WHERE id = $1`, [
      id,
    ]);

    if (clubExists.rows.length === 0) {
      throw CustomError.notFound("El club no existe");
    }

    // Verificar si ya existe otro club con el mismo nombre (normalizado)
    const existingClub = await sql.query(
      `SELECT id, name FROM clubs WHERE LOWER(REGEXP_REPLACE(NORMALIZE(name, NFD), '[\\u0300-\\u036f]', '', 'g')) = $1 AND id != $2`,
      [normalizedName, id]
    );

    if (existingClub.rows.length > 0) {
      throw CustomError.badRequest(
        `Ya existe otro club con el nombre "${existingClub.rows[0].name}"`
      );
    }

    // Actualizar el club
    const result = await sql.query(
      `UPDATE clubs SET name = $1 WHERE id = $2 RETURNING id, name`,
      [trimmedName, id]
    );

    // Revalidar la página de clubes para mostrar los cambios
    revalidatePath("/clubs");

    return {
      club: result.rows[0],
    };
  });
