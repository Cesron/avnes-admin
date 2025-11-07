/**
 * Normaliza un string eliminando tildes y convirtiéndolo a minúsculas
 * Útil para comparaciones de texto sin importar acentos o capitalización
 * @param str - El string a normalizar
 * @returns El string normalizado (minúsculas y sin tildes)
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
