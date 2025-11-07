"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { createChildSchema } from "./create-child.schema";

export const createChildAction = actionClient
  .inputSchema(createChildSchema)
  .action(
    async ({ parsedInput: { firstName, lastName, gender, birthDate } }) => {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      // Crear el nuevo niño/niña
      const result = await sql.query(
        `INSERT INTO children (first_name, last_name, gender, birth_date) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, gender, birth_date`,
        [trimmedFirstName, trimmedLastName, gender, birthDate]
      );

      return {
        child: result.rows[0],
      };
    }
  );
