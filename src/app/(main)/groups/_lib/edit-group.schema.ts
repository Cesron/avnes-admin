import { z } from "zod";

export const editGroupSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres")
    .trim(),
  clubId: z.string().min(1, "Debes seleccionar un club"),
  mentorId: z.string().min(1, "Debes seleccionar una mentora"),
});

export type EditGroupFormData = z.infer<typeof editGroupSchema>;
export type EditGroupFormInput = z.input<typeof editGroupSchema>;
