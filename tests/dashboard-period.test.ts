import assert from "node:assert/strict";
import test from "node:test";
import {
  dashboardMonth,
  dashboardPeriod,
  periodQuery,
  shiftPeriod,
} from "../src/lib/dashboard-period";

const now = new Date("2026-11-02T02:00:00Z");
test("calendar months include leap days and respect local timezone", () => {
  assert.equal(dashboardMonth(undefined, now).start, "2026-11-01");
  assert.equal(dashboardMonth("2024-02", now).end, "2024-02-29");
  assert.equal(dashboardMonth("2026-02", now).end, "2026-02-28");
  assert.equal(dashboardMonth("2026-12", now).endExclusive, "2027-01-01");
  assert.equal(dashboardMonth("2026-13", now).start, "2026-11-01");
  assert.equal(
    dashboardMonth(undefined, new Date("2026-11-01T02:00Z")).start,
    "2026-10-01",
  );
});
test("periods clamp future dates and retain weekly defaults", () => {
  assert.equal(
    dashboardPeriod("month", "2027-01", now).period.start,
    "2026-11-01",
  );
  assert.equal(
    dashboardPeriod(undefined, undefined, now).period.start,
    "2026-10-26",
  );
  assert.equal(dashboardPeriod("invalid", undefined, now).view, "week");
  assert.equal(shiftPeriod("month", "2026-01-01", -1), "2025-12-01");
  assert.equal(shiftPeriod("week", "2026-11-02", -1), "2026-10-26");
});
test("links retain monthly scope and clubs, and preserve existing weekly URLs", () => {
  assert.equal(
    periodQuery("month", "2026-10-01", "club-a").toString(),
    "view=month&month=2026-10&club=club-a",
  );
  assert.equal(periodQuery("week", "2026-10-26").toString(), "week=2026-10-26");
});
