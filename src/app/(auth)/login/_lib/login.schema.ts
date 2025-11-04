import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Por favor, ingresa un correo electrónico válido"),
  password: z.string().min(1, "Por favor, ingresa tu contraseña"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
