import { z } from "zod";

export const editChildSchema = z.object({
  id: z.string().min(1, "ID inválido"),
  familyId: z.string().optional(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres")
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
  pamphletUrl: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  childPhotoUrl: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
});

export type EditChildFormData = z.infer<typeof editChildSchema>;
