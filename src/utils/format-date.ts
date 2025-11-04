import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea una fecha al formato: "15 oct 2025"
 * @param date - La fecha a formatear
 * @returns La fecha formateada en español
 */
export function formatDate(date: Date | string): string {
  const dateObject = typeof date === "string" ? new Date(date) : date;

  return format(dateObject, "d MMM yyyy", { locale: es });
}
