export const PAGE_SIZE = 24;

export type PageRequest = { after?: string; before?: string };
export type PageResult<T> = {
  items: T[];
  previous: string | null;
  next: string | null;
};
export type SearchParams = Record<string, string | string[] | undefined>;

export function singleParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export function readCursor(request: PageRequest) {
  const token = request.after || request.before;
  if (!token || token.length > 300) return null;
  try {
    const value = JSON.parse(Buffer.from(token, "base64url").toString());
    if (
      typeof value.key !== "string" ||
      !/^[0-9]{4,5}$/.test(value.key) ||
      typeof value.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value.id,
      )
    )
      return null;
    return { key: value.key, id: value.id, backwards: !request.after };
  } catch {
    return null;
  }
}

export function makePage<T extends { id: string; penpal_sort: string }>(
  rows: T[],
  cursor: ReturnType<typeof readCursor>,
): PageResult<T> {
  const extra = rows.length > PAGE_SIZE;
  const items = rows.slice(0, PAGE_SIZE);
  if (cursor?.backwards) items.reverse();
  const encode = (item: T) =>
    Buffer.from(
      JSON.stringify({ key: item.penpal_sort, id: item.id }),
    ).toString("base64url");
  return {
    items,
    previous:
      items.length && (cursor?.backwards ? extra : !!cursor)
        ? encode(items[0])
        : null,
    next:
      items.length && (cursor?.backwards ? !!cursor : extra)
        ? encode(items[items.length - 1])
        : null,
  };
}
