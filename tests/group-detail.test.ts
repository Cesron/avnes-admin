import assert from "node:assert/strict";
import test from "node:test";
import { sql } from "../src/lib/sql";
import { getChildren } from "../src/services/children/get-children";
import {
  type AttendanceMetrics,
  attendancePercentage,
} from "../src/services/dashboard/get-weekly-dashboard";
import { getGroup } from "../src/services/groups/get-group";
import {
  GROUP_ATTENDANCE_SQL,
  getGroupAttendance,
} from "../src/services/groups/get-group-attendance";

test("group detail rejects malformed IDs before querying", async () => {
  for (const id of ["invalid", "", "' OR 1=1 --"])
    assert.equal(await getGroup(id), null);
});

// Shadow tables with read-only fixtures so this exercises the actual query.
const definitions = {
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
  GROUP_ATTENDANCE_SQL.slice(5);
const id = (n: number) =>
  `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;

test(
  "group attendance isolates shared activities, membership, dates and pending records",
  { skip: !process.env.DB_HOST },
  async () => {
    const fixture = {
      activity_groups: [
        ...[1, 2, 3].map((n) => ({ activity_id: id(10), group_id: id(n) })),
        { activity_id: id(11), group_id: id(2) },
      ],
      activity_occurrences: [
        {
          id: id(30),
          activity_id: id(10),
          start_datetime: "2026-10-27 10:00",
          end_datetime: "2026-10-27 11:00",
          status: "scheduled",
        },
        {
          id: id(31),
          activity_id: id(10),
          start_datetime: "2026-10-26 10:00",
          end_datetime: "2026-10-26 11:00",
          status: "scheduled",
        },
        {
          id: id(32),
          activity_id: id(10),
          start_datetime: "2026-10-28 14:00",
          end_datetime: "2026-10-28 15:00",
          status: "scheduled",
        },
        {
          id: id(33),
          activity_id: id(10),
          start_datetime: "2026-10-27 10:00",
          end_datetime: "2026-10-27 11:00",
          status: "cancelled",
        },
        {
          id: id(34),
          activity_id: id(10),
          start_datetime: "2026-11-02 00:00",
          end_datetime: "2026-11-02 01:00",
          status: "scheduled",
        },
        {
          id: id(35),
          activity_id: id(11),
          start_datetime: "2026-10-27 10:00",
          end_datetime: "2026-10-27 11:00",
          status: "scheduled",
        },
      ],
      children: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
        id: id(40 + n),
        created_at: n === 5 ? "2026-10-28" : "2026-01-01",
      })),
      children_groups: [
        ...[1, 2, 3, 4, 5].map((n) => ({
          child_id: id(40 + n),
          group_id: id(1),
          active: true,
        })),
        { child_id: id(46), group_id: id(1), active: false },
        { child_id: id(41), group_id: id(2), active: true },
        { child_id: id(47), group_id: id(2), active: true },
      ],
      attendances: [
        ...["present", "absent", "excused"].map((status, n) => ({
          id: id(50 + n),
          child_id: id(41 + n),
          activity_occurrence_id: id(30),
          status,
        })),
        {
          id: id(53),
          child_id: id(41),
          activity_occurrence_id: id(35),
          status: "present",
        },
        {
          id: id(54),
          child_id: id(46),
          activity_occurrence_id: id(30),
          status: "present",
        },
        {
          id: id(55),
          child_id: id(47),
          activity_occurrence_id: id(30),
          status: "present",
        },
        {
          id: id(56),
          child_id: id(41),
          activity_occurrence_id: id(32),
          status: "present",
        },
        {
          id: id(57),
          child_id: id(41),
          activity_occurrence_id: id(33),
          status: "present",
        },
      ],
    };
    async function run(
      group = id(1),
      start = "2026-10-26",
      end = "2026-11-02",
    ) {
      const result = await sql.query<AttendanceMetrics>(fixtureSQL, [
        group,
        start,
        end,
        "2026-10-28T18:00:00Z",
        JSON.stringify(fixture),
      ]);
      return result.rows[0];
    }
    try {
      const summary = await run();
      assert.deepEqual(summary, {
        expected: 8,
        recorded: 3,
        present: 1,
        absent: 1,
        excused: 1,
        pending: 5,
        occurrences: 2,
      });
      assert.equal(attendancePercentage(summary), 50);
      assert.equal(Math.round((summary.recorded / summary.expected) * 100), 38);
      const other = await run(id(2));
      assert.equal(other.expected, 6);
      assert.equal(other.present, 3);
      assert.equal(other.absent, 0);
      const noMembers = await run(id(3));
      assert.equal(noMembers.expected, 0);
      assert.equal(noMembers.occurrences, 2);
      assert.equal(attendancePercentage(noMembers), null);
      const noActivities = await run(id(1), "2026-09-01", "2026-09-08");
      assert.equal(noActivities.occurrences, 0);
      assert.equal(noActivities.pending, 0);
      assert.equal(attendancePercentage(noActivities), null);
      const singleDay = await run(id(1), "2026-10-27", "2026-10-28");
      assert.equal(singleDay.expected, 4);
      assert.equal(singleDay.occurrences, 1);
      for (const attendance of fixture.attendances)
        attendance.status = "excused";
      const excusedOnly = await run();
      assert.equal(excusedOnly.excused, 3);
      assert.equal(attendancePercentage(excusedOnly), null);

      const existing = await sql.query<{ id: string }>(
        "SELECT id FROM groups LIMIT 1",
      );
      assert.ok(existing.rows[0], "Requires an existing group");
      const group = await getGroup(existing.rows[0].id);
      assert.ok(group);
      const count = await sql.query<{ count: number }>(
        "SELECT COUNT(DISTINCT child_id)::int AS count FROM children_groups WHERE group_id = $1 AND active = true",
        [group.id],
      );
      assert.equal(group.children_count, count.rows[0].count);
      const children = await getChildren({ groupId: group.id });
      assert.ok(children.items.every((child) => child.group_id === group.id));
      const actual = await getGroupAttendance(
        group.id,
        "2026-10-26",
        "2026-11-02",
      );
      assert.equal(
        actual.recorded,
        actual.present + actual.absent + actual.excused,
      );
      assert.equal(actual.expected, actual.recorded + actual.pending);
      assert.equal(await getGroup(id(999999)), null);
    } finally {
      await sql.end();
    }
  },
);
