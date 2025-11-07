/**
 * Calcula la edad de una persona a partir de su fecha de nacimiento
 * @param birthDate - La fecha de nacimiento
 * @returns La edad en años o null si no se proporciona fecha
 */
export function calculateAge(birthDate: Date | null): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
