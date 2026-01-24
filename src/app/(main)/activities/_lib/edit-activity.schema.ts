import { z } from "zod";

// Base schema for editing activity
const baseEditActivitySchema = z.object({
  id: z.string().min(1, "ID inválido"),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(150, "El nombre no puede exceder los 150 caracteres")
    .trim(),
  description: z.string().optional(),
  groupIds: z.array(z.string()).min(1, "Debes seleccionar al menos un grupo"),
  isRecurring: z.boolean(),

  // Non-recurring activity fields
  singleDate: z.string().optional(),
  singleStartTime: z.string().optional(),
  singleEndTime: z.string().optional(),

  // Recurring activity fields
  frequency: z.string().optional(),
  interval: z.coerce.number().min(1).optional(),
  daysOfWeek: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const editActivitySchema = baseEditActivitySchema.refine(
  (data) => {
    if (!data.isRecurring) {
      return (
        !!data.singleDate && !!data.singleStartTime && !!data.singleEndTime
      );
    }
    return (
      !!data.frequency &&
      data.daysOfWeek &&
      data.daysOfWeek.length > 0 &&
      !!data.startDate &&
      !!data.startTime &&
      !!data.endTime
    );
  },
  {
    message: "Por favor completa todos los campos requeridos",
    path: ["isRecurring"],
  },
);

export type EditActivityFormData = z.infer<typeof baseEditActivitySchema>;
