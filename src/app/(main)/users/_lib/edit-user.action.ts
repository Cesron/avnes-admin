"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
import { editUserSchema } from "./edit-user.schema";

export const editUserAction = actionClient
  .inputSchema(editUserSchema)
  .action(async ({ parsedInput: { id, name, role, mentorId } }) => {
    const userExists = await sql.query(`SELECT id FROM "user" WHERE id = $1`, [
      id,
    ]);
    if (userExists.rows.length === 0) {
      throw CustomError.notFound("El usuario no existe");
    }

    if (role === "mentor" && mentorId) {
      const mentorResult = await sql.query(
        `SELECT id, user_id FROM mentors WHERE id = $1`,
        [mentorId],
      );
      if (mentorResult.rows.length === 0) {
        throw CustomError.badRequest("La mentora seleccionada no existe");
      }
      if (mentorResult.rows[0].user_id && mentorResult.rows[0].user_id !== id) {
        throw CustomError.conflict(
          "La mentora seleccionada ya está vinculada a otro usuario",
        );
      }
    }

    await sql.query(`UPDATE "user" SET name = $1, role = $2 WHERE id = $3`, [
      name.trim(),
      role,
      id,
    ]);

    // Unlink any previously linked mentor
    await sql.query(`UPDATE mentors SET user_id = NULL WHERE user_id = $1`, [
      id,
    ]);

    // Link new mentor if applicable
    if (role === "mentor" && mentorId) {
      await sql.query(`UPDATE mentors SET user_id = $1 WHERE id = $2`, [
        id,
        mentorId,
      ]);
    }

    revalidatePath("/users");
    return { userId: id };
  });
