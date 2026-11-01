export const DASHBOARD_TIME_ZONE = "America/El_Salvador";

export function localToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DASHBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function shiftDate(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function dashboardWeek(input?: string, now = new Date()) {
  const today = localToday(now);
  const parsed =
    input && /^\d{4}-\d{2}-\d{2}$/.test(input)
      ? new Date(`${input}T12:00:00Z`)
      : null;
  const valid =
    parsed &&
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === input;
  const date = valid && input ? input : today;
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  const start = shiftDate(date, day === 0 ? -6 : 1 - day);
  return {
    start,
    end: shiftDate(start, 6),
    endExclusive: shiftDate(start, 7),
    today,
  };
}
export function weekLabel(start: string) {
  const formatter = new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${formatter.format(new Date(`${start}T12:00:00Z`))} – ${formatter.format(new Date(`${shiftDate(start, 6)}T12:00:00Z`))}`;
}
