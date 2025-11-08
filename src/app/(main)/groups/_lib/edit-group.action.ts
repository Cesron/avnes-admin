"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { normalizeString } from "@/utils/normalize-string";
import { revalidatePath } from "next/cache";
import { editGroupSchema } from "./edit-group.schema";

export const editGroupAction = actionClient
  .inputSchema(editGroupSchema)
  .action(async ({ parsedInput: { id, name, clubId, mentorId } }) => {
    const trimmedName = name.trim();
    const normalizedName = normalizeString(trimmedName);

    // Verificar si el grupo existe
    const groupExists = await sql.query(`SELECT id FROM groups WHERE id = $1`, [
      id,
    ]);

    if (groupExists.rows.length === 0) {
      throw CustomError.notFound("El grupo no existe");
    }

    // Verificar si ya existe otro grupo con el mismo nombre (normalizado)
    const existingGroup = await sql.query(
      `SELECT id, name FROM groups WHERE LOWER(REGEXP_REPLACE(NORMALIZE(name, NFD), '[\\u0300-\\u036f]', '', 'g')) = $1 AND id != $2`,
      [normalizedName, id]
    );

    if (existingGroup.rows.length > 0) {
      throw CustomError.badRequest(
        `Ya existe otro grupo con el nombre "${existingGroup.rows[0].name}"`
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

    // Actualizar el grupo
    const result = await sql.query(
      `UPDATE groups SET name = $1, club_id = $2, mentor_id = $3 WHERE id = $4 RETURNING id, name, club_id, mentor_id`,
      [trimmedName, clubId, mentorId, id]
    );

    // Revalidar la página para mostrar los cambios
    revalidatePath("/groups");

    return {
      group: result.rows[0],
    };
  });
