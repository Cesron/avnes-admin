"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { normalizeString } from "@/utils/normalize-string";
import { createGroupSchema } from "./create-group.schema";

export const createGroupAction = actionClient
  .inputSchema(createGroupSchema)
  .action(async ({ parsedInput: { name, clubId, mentorId } }) => {
    const normalizedName = normalizeString(name);

    // Verificar si ya existe un grupo con el mismo nombre (normalizado)
    const existingGroup = await sql.query(
      `SELECT id, name FROM groups WHERE LOWER(REGEXP_REPLACE(NORMALIZE(name, NFD), '[\\u0300-\\u036f]', '', 'g')) = $1`,
      [normalizedName]
    );

    if (existingGroup.rows.length > 0) {
      throw CustomError.badRequest(
        `Ya existe un grupo con el nombre "${existingGroup.rows[0].name}"`
      );
    }

    // Verificar que el club existe
    const clubExists = await sql.query(`SELECT id FROM clubs WHERE id = $1`, [
      clubId,
    ]);

    if (clubExists.rows.length === 0) {
      throw CustomError.badRequest("El club seleccionado no existe");
    }

    // Verificar que la mentora existe
    const mentorExists = await sql.query(
      `SELECT id FROM mentors WHERE id = $1`,
      [mentorId]
    );

    if (mentorExists.rows.length === 0) {
      throw CustomError.badRequest("La mentora seleccionada no existe");
    }

    // Crear el nuevo grupo
    const result = await sql.query(
      `INSERT INTO groups (name, club_id, mentor_id) VALUES ($1, $2, $3) RETURNING id, name, club_id, mentor_id`,
      [name, clubId, mentorId]
    );

    return {
      group: result.rows[0],
    };
  });
