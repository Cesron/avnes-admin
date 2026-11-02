import assert from "node:assert/strict";
import test from "node:test";
import { sql } from "../src/lib/sql";
import {
  getChildAttendanceHistory,
  parseHistoryFilters,
} from "../src/services/children/get-child-attendance-history";

const filters = { from: "", to: "", page: 1 };
test("history filters reject invalid dates and inverted ranges", () => {
  assert.equal(parseHistoryFilters({ from: "2026-02-30" }), null);
  assert.equal(
    parseHistoryFilters({ from: "2026-12-01", to: "2026-01-01" }),
    null,
  );
  assert.equal(parseHistoryFilters({ from: "not-a-date" }), null);
  assert.deepEqual(parseHistoryFilters({ page: "-1" }), filters);
  assert.equal(parseHistoryFilters({ from: "2024-02-29" })?.from, "2024-02-29");
});
test("history denies unknown roles and malformed child IDs before querying", async () => {
  assert.equal(
    await getChildAttendanceHistory(
      "invalid",
      { userId: "test", role: "admin" },
      filters,
    ),
    null,
  );
  assert.equal(
    await getChildAttendanceHistory(
      "00000000-0000-0000-0000-000000000001",
      { userId: "test", role: null },
      filters,
    ),
    null,
  );
});
test(
  "database: history totals, date filters and mentor access",
  { skip: !process.env.DB_HOST },
  async () => {
    try {
      const children = await sql.query<{ id: string }>(
        "SELECT id FROM children LIMIT 1",
      );
      assert.ok(children.rows[0], "Requires an existing child");
      const id = children.rows[0].id;
      const admin = { userId: "history-read-test", role: "admin" as const };
      const result = await getChildAttendanceHistory(id, admin, filters);
      assert.ok(result);
      assert.equal(
        result.summary.total,
        result.summary.present + result.summary.absent + result.summary.excused,
      );
      assert.ok(result.items.length <= 25);
      assert.equal(
        await getChildAttendanceHistory(
          id,
          { userId: "history-unlinked-mentor", role: "mentor" },
          filters,
        ),
        null,
      );
      assert.ok(
        await getChildAttendanceHistory(
          id,
          { ...admin, role: "coordinator" },
          filters,
        ),
      );
      const members = await sql.query<{ child_id: string; user_id: string }>(`
      SELECT cg.child_id, m.user_id FROM children_groups cg
      JOIN groups g ON g.id = cg.group_id JOIN mentors m ON m.id = g.mentor_id
      WHERE cg.active = true AND m.user_id IS NOT NULL LIMIT 1`);
      if (members.rows[0]) {
        const member = members.rows[0];
        const mentor = { userId: member.user_id, role: "mentor" as const };
        assert.ok(
          await getChildAttendanceHistory(member.child_id, mentor, filters),
        );
        const forbidden = await sql.query<{ id: string }>(
          `SELECT c.id FROM children c WHERE NOT EXISTS (
        SELECT 1 FROM children_groups cg JOIN groups g ON g.id = cg.group_id JOIN mentors m ON m.id = g.mentor_id
        WHERE cg.child_id = c.id AND cg.active = true AND m.user_id = $1) LIMIT 1`,
          [member.user_id],
        );
        if (forbidden.rows[0])
          assert.equal(
            await getChildAttendanceHistory(
              forbidden.rows[0].id,
              mentor,
              filters,
            ),
            null,
          );
      }
      if (result.items[0]) {
        const date = result.items[0].date;
        const sameDay = await getChildAttendanceHistory(id, admin, {
          from: date,
          to: date,
          page: 1,
        });
        assert.ok(sameDay);
        assert.ok(sameDay.items.every((row) => row.date === date));
      }
    } finally {
      await sql.end();
    }
  },
);
