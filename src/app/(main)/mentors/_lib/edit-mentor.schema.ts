import { z } from "zod";

export const editMentorSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres")
    .trim(),
  phone: z
    .string()
    .max(20, "El teléfono no puede exceder los 20 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .max(100, "El email no puede exceder los 100 caracteres")
    .email("Formato de email inválido")
    .trim()
    .optional()
    .or(z.literal("")),
});

export type EditMentorFormData = z.infer<typeof editMentorSchema>;
