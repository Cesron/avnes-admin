"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { loginSchema } from "./login.schema";
import { CustomError } from "@/utils/custom-error";

export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: { email, password, rememberMe } }) => {
    await auth.api
      .signInEmail({
        body: {
          email,
          password,
          rememberMe,
        },
      })
      .catch((error) => {
        if (error.statusCode === 401) {
          console.error("Unauthorized access attempt with email:", email);

          throw CustomError.unauthorized(
            "Credenciales inválidas, verifica los datos e inténtalo de nuevo."
          );
        }

        throw error;
      });
  });
