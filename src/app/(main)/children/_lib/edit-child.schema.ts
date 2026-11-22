import { z } from "zod";
import { optionalLongText } from "@/lib/long-text";

export const editChildSchema = z
  .object({
    notes: optionalLongText,
    id: z.string().min(1, "ID inválido"),
    familyId: z.string().optional(),
    groupId: z.string().uuid("Selecciona un grupo válido").optional(),
    previousGroupId: z
      .string()
      .uuid("Grupo actual inválido")
      .nullable()
      .optional(),
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
        { message: "La fecha de nacimiento no puede ser futura" },
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
  })
  .refine(
    (data) => data.groupId === undefined || data.previousGroupId !== undefined,
    {
      message: "Vuelve a abrir la ficha para cambiar el grupo",
      path: ["groupId"],
    },
  );

export type EditChildFormData = z.infer<typeof editChildSchema>;
