import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres")
    .trim(),
  clubId: z.string().min(1, "Debes seleccionar un club"),
  mentorId: z.string().min(1, "Debes seleccionar una mentora"),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type CreateGroupFormInput = z.input<typeof createGroupSchema>;
