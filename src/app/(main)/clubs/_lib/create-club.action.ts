"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { normalizeString } from "@/utils/normalize-string";
import { createClubSchema } from "./create-club.schema";

export const createClubAction = actionClient
  .inputSchema(createClubSchema)
  .action(async ({ parsedInput: { name } }) => {
    const trimmedName = name.trim();
    const normalizedName = normalizeString(trimmedName);

    // Verificar si ya existe un club con el mismo nombre (normalizado)
    const existingClub = await sql.query(
      `SELECT id, name FROM clubs WHERE LOWER(REGEXP_REPLACE(NORMALIZE(name, NFD), '[\\u0300-\\u036f]', '', 'g')) = $1`,
      [normalizedName]
    );

    if (existingClub.rows.length > 0) {
      throw CustomError.badRequest(
        `Ya existe un club con el nombre "${existingClub.rows[0].name}"`
      );
    }

    // Crear el nuevo club
    const result = await sql.query(
      `INSERT INTO clubs (name) VALUES ($1) RETURNING id, name`,
      [trimmedName]
    );

    return {
      club: result.rows[0],
    };
  });
