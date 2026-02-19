"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
import { createUserSchema } from "./create-user.schema";

export const createUserAction = actionClient
  .inputSchema(createUserSchema)
  .action(
    async ({ parsedInput: { name, email, password, role, mentorId } }) => {
      // If role is mentor, verify the mentor exists and is not already linked
      if (role === "mentor" && mentorId) {
        const mentorResult = await sql.query(
          `SELECT id, user_id FROM mentors WHERE id = $1`,
          [mentorId],
        );

        if (mentorResult.rows.length === 0) {
          throw CustomError.badRequest("La mentora seleccionada no existe");
        }

        if (mentorResult.rows[0].user_id) {
          throw CustomError.conflict(
            "La mentora seleccionada ya está vinculada a otro usuario",
          );
        }
      }

      // Check if email is already in use
      const existingUser = await sql.query(
        `SELECT id FROM "user" WHERE email = $1`,
        [email],
      );

      if (existingUser.rows.length > 0) {
        throw CustomError.conflict("Ya existe un usuario con este email");
      }

      // Create user via Better Auth admin API
      // Better Auth only supports "user" | "admin" roles natively,
      // so we create with "admin" and then update to the actual role
      const result = await auth.api.createUser({
        body: {
          name: name.trim(),
          email,
          password,
          role: "admin",
        },
      });

      if (!result?.user?.id) {
        throw CustomError.internal("No se pudo crear el usuario");
      }

      const userId = result.user.id;

      // Update to the actual custom role
      await sql.query(`UPDATE "user" SET role = $1 WHERE id = $2`, [
        role,
        userId,
      ]);

      // Link mentor to user if applicable
      if (role === "mentor" && mentorId) {
        await sql.query(`UPDATE mentors SET user_id = $1 WHERE id = $2`, [
          userId,
          mentorId,
        ]);
      }

      revalidatePath("/users");

      return { userId };
    },
  );
