"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
import { editChildSchema } from "./edit-child.schema";

export const editChildAction = actionClient
  .inputSchema(editChildSchema)
  .action(
    async ({ parsedInput: { id, firstName, lastName, gender, birthDate } }) => {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      // Verificar si el niño existe
      const childExists = await sql.query(
        `SELECT id FROM children WHERE id = $1`,
        [id]
      );

      if (childExists.rows.length === 0) {
        throw CustomError.notFound("El niño/niña no existe");
      }

      // Validar que la fecha de nacimiento no sea futura
      const birthDateObj = new Date(birthDate);
      const today = new Date();

      if (birthDateObj > today) {
        throw CustomError.badRequest(
          "La fecha de nacimiento no puede ser futura"
        );
      }

      // Actualizar el niño
      const result = await sql.query(
        `UPDATE children SET first_name = $1, last_name = $2, gender = $3, birth_date = $4 WHERE id = $5 RETURNING id, first_name, last_name, gender, birth_date`,
        [trimmedFirstName, trimmedLastName, gender, birthDate, id]
      );

      // Revalidar la página para mostrar los cambios
      revalidatePath("/children");

      return {
        child: result.rows[0],
      };
    }
  );
