import { z } from "zod";
import { optionalLongText } from "@/lib/long-text";

export const createFamilySchema = z.object({
  history: optionalLongText,
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

export type CreateFamilyFormData = z.infer<typeof createFamilySchema>;
