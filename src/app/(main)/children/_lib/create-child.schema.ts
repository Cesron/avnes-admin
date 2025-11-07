import { z } from "zod";

export const createChildSchema = z.object({
  firstName: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres")
    .trim(),
  lastName: z
    .string()
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(50, "El apellido no puede exceder los 50 caracteres")
    .trim(),
  gender: z
    .string()
    .min(1, "Debes seleccionar el sexo")
    .refine((val) => val === "M" || val === "F", {
      message: "El sexo debe ser Masculino o Femenino",
    }),
  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine(
      (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        return birthDate <= today;
      },
      { message: "La fecha de nacimiento no puede ser futura" }
    ),
});

export type CreateChildFormData = z.infer<typeof createChildSchema>;
