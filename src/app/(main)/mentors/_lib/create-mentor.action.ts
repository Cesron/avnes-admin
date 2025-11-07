"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { createMentorSchema } from "./create-mentor.schema";

export const createMentorAction = actionClient
  .inputSchema(createMentorSchema)
  .action(async ({ parsedInput: { name, phone, email } }) => {
    const trimmedName = name.trim();
    const trimmedPhone = phone?.trim() || null;
    const trimmedEmail = email?.trim() || null;

    // Verificar si el teléfono ya existe (si se proporciona)
    if (trimmedPhone) {
      const existingPhone = await sql.query(
        `SELECT id, name FROM mentors WHERE phone = $1`,
        [trimmedPhone]
      );

      if (existingPhone.rows.length > 0) {
        throw CustomError.badRequest(
          `El teléfono ya está registrado para el mentor "${existingPhone.rows[0].name}"`
        );
      }
    }

    // Verificar si el email ya existe (si se proporciona)
    if (trimmedEmail) {
      const existingEmail = await sql.query(
        `SELECT id, name FROM mentors WHERE email = $1`,
        [trimmedEmail]
      );

      if (existingEmail.rows.length > 0) {
        throw CustomError.badRequest(
          `El email ya está registrado para el mentor "${existingEmail.rows[0].name}"`
        );
      }
    }

    // Crear el nuevo mentor
    const result = await sql.query(
      `INSERT INTO mentors (name, phone, email) VALUES ($1, $2, $3) RETURNING id, name, phone, email`,
      [trimmedName, trimmedPhone, trimmedEmail]
    );

    return {
      mentor: result.rows[0],
    };
  });
