"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
import { editMentorSchema } from "./edit-mentor.schema";

export const editMentorAction = actionClient
  .inputSchema(editMentorSchema)
  .action(async ({ parsedInput: { id, name, phone, email } }) => {
    const trimmedName = name.trim();
    const trimmedPhone = phone?.trim() || null;
    const trimmedEmail = email?.trim() || null;

    // Verificar si el mentor existe
    const mentorExists = await sql.query(
      `SELECT id FROM mentors WHERE id = $1`,
      [id]
    );

    if (mentorExists.rows.length === 0) {
      throw CustomError.notFound("El mentor no existe");
    }

    // Verificar si el teléfono ya existe en otro mentor (si se proporciona)
    if (trimmedPhone) {
      const existingPhone = await sql.query(
        `SELECT id, name FROM mentors WHERE phone = $1 AND id != $2`,
        [trimmedPhone, id]
      );

      if (existingPhone.rows.length > 0) {
        throw CustomError.badRequest(
          `El teléfono ya está registrado para el mentor "${existingPhone.rows[0].name}"`
        );
      }
    }

    // Verificar si el email ya existe en otro mentor (si se proporciona)
    if (trimmedEmail) {
      const existingEmail = await sql.query(
        `SELECT id, name FROM mentors WHERE email = $1 AND id != $2`,
        [trimmedEmail, id]
      );

      if (existingEmail.rows.length > 0) {
        throw CustomError.badRequest(
          `El email ya está registrado para el mentor "${existingEmail.rows[0].name}"`
        );
      }
    }

    // Actualizar el mentor
    const result = await sql.query(
      `UPDATE mentors SET name = $1, phone = $2, email = $3 WHERE id = $4 RETURNING id, name, phone, email`,
      [trimmedName, trimmedPhone, trimmedEmail, id]
    );

    // Revalidar la página para mostrar los cambios
    revalidatePath("/mentors");

    return {
      mentor: result.rows[0],
    };
  });
