import { z } from "zod";

export const profileName = z
  .string()
  .trim()
  .min(1, "Escribe tu nombre.")
  .max(100, "El nombre debe tener como máximo 100 caracteres.");

export const profilePhone = z
  .string()
  .trim()
  .max(30, "El teléfono debe tener como máximo 30 caracteres.")
  .refine(
    (value) => !value || (/^\+?[\d ().-]+$/.test(value) && /\d/.test(value)),
    "Escribe un número de teléfono válido.",
  );

export const profilePhoto = z
  .string()
  .trim()
  .max(2048, "El enlace debe tener como máximo 2048 caracteres.")
  .pipe(
    z.url({ protocol: /^https?$/, message: "Escribe una URL HTTP o HTTPS." }),
  );
