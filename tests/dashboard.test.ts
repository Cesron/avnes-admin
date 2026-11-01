import assert from "node:assert/strict";
import test from "node:test";
import { dashboardWeek, localToday } from "../src/lib/dashboard-week";
import { sql } from "../src/lib/sql";
import {
  attendancePercentage,
  WEEKLY_DASHBOARD_SQL,
  type WeeklyDashboard,
} from "../src/services/dashboard/get-weekly-dashboard";

test("week boundaries use El Salvador, including year changes and invalid dates", () => {
  assert.equal(localToday(new Date("2026-11-02T02:00:00Z")), "2026-11-01");
  assert.equal(
    dashboardWeek(undefined, new Date("2026-11-02T02:00:00Z")).start,
    "2026-10-26",
  );
  assert.equal(dashboardWeek("2027-01-01").start, "2026-12-28");
  assert.equal(
    dashboardWeek("2026-02-30", new Date("2026-10-31T18:00Z")).start,
    "2026-10-26",
  );
  assert.equal(attendancePercentage({ present: 3, absent: 1 }), 75);
  assert.equal(attendancePercentage({ present: 0, absent: 0 }), null);
});

// CTE fixtures shadow real tables: the SQL under test executes unchanged, with no writes.
const definitions = {
  clubs: "id uuid, name text",
  groups: "id uuid, name text, club_id uuid",
  activities: "id uuid, name text",
  activity_occurrences:
    "id uuid, activity_id uuid, start_datetime timestamp, end_datetime timestamp, status text",
  activity_groups: "activity_id uuid, group_id uuid",
  children: "id uuid, created_at timestamp",
  children_groups: "child_id uuid, group_id uuid, active boolean",
  attendances:
    "id uuid, child_id uuid, activity_occurrence_id uuid, status text",
};
const fixtureSQL =
  "WITH " +
  Object.entries(definitions)
    .map(
      ([name, fields]) =>
        `${name} AS (SELECT * FROM json_to_recordset($5::json->'${name}') AS t(${fields}))`,
    )
    .join(",") +
  "," +
  WEEKLY_DASHBOARD_SQL.slice(5);
const id = (n: number) =>
  `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;

test(
  "SQL correctly separates attendance, pending data and shared activities",
  { skip: !process.env.DB_HOST },
  async () => {
    const fixture = {
      clubs: [
        { id: id(1), name: "Club A" },
        { id: id(2), name: "Club B" },
        { id: id(3), name: "Empty club" },
      ],
      groups: [1, 2, 3].map((n) => ({
        id: id(10 + n),
        name: `Group ${n}`,
        club_id: id(n === 3 ? 2 : 1),
      })),
      activities: [{ id: id(20), name: "Shared activity" }],
      activity_groups: [1, 2, 3].map((n) => ({
        activity_id: id(20),
        group_id: id(10 + n),
      })),
      activity_occurrences: [
        {
          id: id(30),
          activity_id: id(20),
          start_datetime: "2026-10-27 10:00",
          end_datetime: "2026-10-27 11:00",
          status: "scheduled",
        },
        {
          id: id(31),
          activity_id: id(20),
          start_datetime: "2026-10-26 10:00",
          end_datetime: "2026-10-26 11:00",
          status: "scheduled",
        },
        {
          id: id(32),
          activity_id: id(20),
          start_datetime: "2026-10-28 14:00",
          end_datetime: "2026-10-28 15:00",
          status: "scheduled",
        },
        {
          id: id(33),
          activity_id: id(20),
          start_datetime: "2026-10-27 10:00",
          end_datetime: "2026-10-27 11:00",
          status: "cancelled",
        },
        {
          id: id(34),
          activity_id: id(20),
          start_datetime: "2026-11-02 00:00",
          end_datetime: "2026-11-02 01:00",
          status: "scheduled",
        },
      ],
      children: [1, 2, 3, 4, 5].map((n) => ({
        id: id(40 + n),
        created_at: n === 5 ? "2026-10-28" : "2026-01-01",
      })),
      children_groups: [
        ...[1, 2, 3, 4, 5].map((n) => ({
          child_id: id(40 + n),
          group_id: id(11),
          active: true,
        })),
        { child_id: id(41), group_id: id(12), active: true },
        { child_id: id(41), group_id: id(13), active: true },
      ],
      attendances: ["present", "absent", "excused"].map((status, n) => ({
        id: id(50 + n),
        child_id: id(41 + n),
        activity_occurrence_id: id(30),
        status,
      })),
    };
    async function run(
      club: string | null = null,
      start = "2026-10-26",
      end = "2026-11-02",
    ) {
      const result = await sql.query<{ data: WeeklyDashboard }>(fixtureSQL, [
        start,
        end,
        club,
        "2026-10-28T18:00:00Z",
        JSON.stringify(fixture),
      ]);
      return result.rows[0].data;
    }
    try {
      const data = await run();
      assert.deepEqual(data.summary, {
        expected: 8,
        recorded: 3,
        present: 1,
        absent: 1,
        excused: 1,
        pending: 5,
        occurrences: 2,
      });
      assert.equal(attendancePercentage(data.summary), 50);
      assert.equal(data.pendingCount, 2);
      assert.equal(data.groups.find((g) => g.id === id(12))?.expected, 2);
      assert.equal(data.clubs.find((c) => c.id === id(1))?.expected, 8);
      assert.equal(data.clubs.find((c) => c.id === id(3))?.expected, null);
      const scoped = await run(id(2));
      assert.equal(scoped.summary.expected, 2);
      assert.equal(scoped.summary.present, 1);
      assert.equal(scoped.summary.absent, 0);
      assert.equal(scoped.groups.length, 1);
      const empty = await run(null, "2026-09-01", "2026-09-08");
      assert.equal(empty.summary.expected, 0);
      assert.equal(attendancePercentage(empty.summary), null);
      assert.equal(empty.pending.length, 0);
      for (const att of fixture.attendances) att.status = "excused";
      const justified = await run();
      assert.equal(justified.summary.excused, 3);
      assert.equal(justified.summary.absent, 0);
      assert.equal(attendancePercentage(justified.summary), null);
    } finally {
      await sql.end();
    }
  },
);
