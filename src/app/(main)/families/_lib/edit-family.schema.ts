import { z } from "zod";

export const editFamilySchema = z.object({
  id: z.string().min(1, "ID inválido"),
  penpalCode: z
    .string()
    .length(4, "El código penpal debe tener exactamente 4 caracteres")
    .regex(/^\d{4}$/, "El código penpal debe contener solo números"),
  familyBiographyUrl: z
    .string()
    .url("Debe ser una URL válida")
    .or(z.literal(""))
    .optional(),
  familyPhotoUrl: z
    .string()
    .url("Debe ser una URL válida")
    .or(z.literal(""))
    .optional(),
});

export type EditFamilyFormData = z.infer<typeof editFamilySchema>;
