import { z } from "zod";

export const editUserSchema = z
  .object({
    id: z.string().min(1, "ID inválido"),
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder los 100 caracteres")
      .trim(),
    role: z.enum(["admin", "coordinator", "mentor"], {
      message: "Selecciona un rol",
    }),
    mentorId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "mentor") return !!data.mentorId;
      return true;
    },
    {
      message: "Debes seleccionar una mentora para este rol",
      path: ["mentorId"],
    },
  );

export type EditUserFormData = z.infer<typeof editUserSchema>;
