import {
  dashboardWeek,
  localToday,
  shiftDate,
  weekLabel,
} from "./dashboard-week";

export type DashboardView = "week" | "month";
export function shiftMonth(start: string, amount: number) {
  const date = new Date(`${start.slice(0, 7)}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + amount);
  return date.toISOString().slice(0, 10);
}
export function dashboardMonth(input?: string, now = new Date()) {
  const today = localToday(now);
  const month =
    input && /^\d{4}-(0[1-9]|1[0-2])$/.test(input) ? input : today.slice(0, 7);
  const start = `${month}-01`;
  const endExclusive = shiftMonth(start, 1);
  return { start, end: shiftDate(endExclusive, -1), endExclusive, today };
}
export function dashboardPeriod(
  viewInput?: string,
  input?: string,
  now = new Date(),
) {
  const view: DashboardView = viewInput === "month" ? "month" : "week";
  const resolve = view === "month" ? dashboardMonth : dashboardWeek;
  const current = resolve(undefined, now);
  const requested = resolve(input, now);
  return {
    view,
    current,
    period: requested.start > current.start ? current : requested,
  };
}
export function shiftPeriod(
  view: DashboardView,
  start: string,
  amount: number,
) {
  return view === "month"
    ? shiftMonth(start, amount)
    : shiftDate(start, amount * 7);
}
export function periodQuery(
  view: DashboardView,
  start: string,
  club?: string | null,
) {
  const params = new URLSearchParams(
    view === "month" ? { view, month: start.slice(0, 7) } : { week: start },
  );
  if (club) params.set("club", club);
  return params;
}
export function periodLabel(view: DashboardView, start: string) {
  return view === "week"
    ? weekLabel(start)
    : new Intl.DateTimeFormat("es-SV", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${start}T12:00:00Z`));
}
