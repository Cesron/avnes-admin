import { z } from "zod";

export const editClubSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres")
    .trim(),
});

export type EditClubFormData = z.infer<typeof editClubSchema>;
