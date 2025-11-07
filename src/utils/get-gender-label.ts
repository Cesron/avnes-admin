/**
 * Obtiene el texto completo del género a partir del código
 * @param gender - El código de género ("M" o "F")
 * @returns El texto completo del género ("Masculino" o "Femenino")
 */
export function getGenderLabel(gender: string): string {
  if (gender === "M") return "Masculino";
  if (gender === "F") return "Femenino";
  return gender;
}
