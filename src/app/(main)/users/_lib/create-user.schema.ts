import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder los 100 caracteres")
      .trim(),
    email: z.string().email("Ingresa un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.enum(["admin", "coordinator", "mentor"], {
      message: "Selecciona un rol",
    }),
    mentorId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "mentor") {
        return !!data.mentorId;
      }
      return true;
    },
    {
      message: "Debes seleccionar una mentora para este rol",
      path: ["mentorId"],
    },
  );

export type CreateUserFormData = z.infer<typeof createUserSchema>;
