import { z } from "zod";

export const optionalLongText = z
  .string()
  .max(10_000, "Escribe un máximo de 10,000 caracteres.")
  .optional();
