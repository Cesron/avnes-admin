import { normalizeString } from "@/utils/normalize-string";

export function searchPattern(search: string): string {
  return `%${normalizeString(search.trim())}%`;
}

/** Match the client-side normalization without requiring a database extension.
 * Only static SQL column names belong here; search input stays parameterized.
 */
export function searchColumn(
  column: "c.name" | "child.name" | "f.penpal_code",
): string {
  return `regexp_replace(normalize(lower(${column}), NFD), U&'[\\0300-\\036f]', '', 'g')`;
}
