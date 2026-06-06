/**
 * Devuelve el primer nombre de un nombre completo. Se considera "primer
 * nombre" la primera palabra antes del primer espacio. Si no hay un
 * primer nombre identificable, devuelve string vacío.
 *
 * @example
 * getFirstName("Adiel Alexander Abrego Ramirez") // "Adiel"
 * getFirstName("Genesis Yajaira Chávez Vásquez") // "Genesis"
 * getFirstName("")                               // ""
 */
export function getFirstName(fullName: string | null | undefined): string {
  if (!fullName) return "";
  const first = fullName.trim().split(/\s+/)[0];
  return first ?? "";
}

/**
 * Devuelve la primera letra del primer nombre en mayúsculas.
 * Útil para los avatares de los chips de niños.
 *
 * @example
 * getFirstInitial("Adiel") // "A"
 * getFirstInitial("genesis") // "G"
 */
export function getFirstInitial(fullName: string | null | undefined): string {
  const first = getFirstName(fullName);
  return first[0]?.toUpperCase() ?? "";
}

/**
 * Extrae los apellidos (últimas 2 palabras) de un nombre completo.
 *
 * En la convención hispanohablante, el formato habitual es
 * `Nombre1 Nombre2 Apellido1 Apellido2` (4 partes). Esta función toma
 * las últimas 2 palabras como apellidos, lo que cubre el caso común.
 *
 * Casos borde manejados:
 * - 1 parte  → esa parte (sin nombres, solo apellido único).
 * - 2 partes → la última (1 nombre + 1 apellido).
 * - 3 partes → las 2 últimas (cubre 1+2 o 2+1, mejor esfuerzo).
 * - 4+ partes → las 2 últimas.
 *
 * @example
 * extractSurnames("Adiel Alexander Abrego Ramirez") // "Abrego Ramirez"
 * extractSurnames("Genesis Yajaira Chávez Vásquez") // "Chávez Vásquez"
 * extractSurnames("Maria Lopez")                    // "Lopez"
 */
export function extractSurnames(fullName: string | null | undefined): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0] ?? "";
  if (parts.length === 2) return parts[1] ?? "";
  return parts.slice(-2).join(" ");
}

/**
 * Devuelve las iniciales (primera letra de cada apellido) en mayúsculas.
 *
 * @example
 * getSurnameInitials("Abrego Ramirez") // "AR"
 * getSurnameInitials("Lopez")          // "L"
 * getSurnameInitials("")               // ""
 */
export function getSurnameInitials(
  surnames: string | null | undefined,
): string {
  if (!surnames) return "";
  return surnames
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Convierte una URL de Google Drive (`/file/d/{id}/view`) en una URL
 * de imagen directa servida por `lh3.googleusercontent.com`.
 *
 * Esta URL es la que se puede usar como `src` de un `<img>` directamente
 * sin necesidad de autenticación cuando el archivo de Drive es público.
 *
 * Acepta los formatos:
 * - https://drive.google.com/file/d/{id}/view
 * - https://drive.google.com/file/d/{id}/view?usp=sharing
 * - https://drive.google.com/open?id={id}
 * - https://drive.google.com/uc?id={id}&export=download
 *
 * Si la URL no encaja en ningún patrón conocido, la devuelve tal cual
 * para no romper URLs externas válidas.
 */
export function convertGoogleDriveImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;

  // /file/d/{fileId}/...
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }

  // ?id={fileId} o &id={fileId}
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // Si ya es una URL de lh3.googleusercontent.com, la dejamos como está
  if (url.includes("lh3.googleusercontent.com")) {
    return url;
  }

  return url;
}
