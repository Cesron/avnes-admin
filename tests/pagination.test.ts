import assert from "node:assert/strict";
import test from "node:test";
import { PAGE_SIZE, readCursor } from "../src/lib/pagination";
import { sql } from "../src/lib/sql";
import { getChildren } from "../src/services/children/get-children";
import { getFamilies } from "../src/services/families/get-families";

test("invalid cursors fall back to the first page", () => {
  for (const token of [
    "invalid",
    "x".repeat(301),
    Buffer.from('{"key":"0001","id":"invalid"}').toString("base64url"),
  ]) {
    assert.equal(readCursor({ after: token }), null);
  }
});

test(
  "database pagination: complete traversal, backwards, filters and empty scope",
  { skip: !process.env.DB_HOST },
  async () => {
    try {
      for (const [fetchPage, table] of [
        [getFamilies, "families"],
        [getChildren, "children"],
      ] as const) {
        const first = await fetchPage();
        assert.equal(first.previous, null);
        let page = first;
        const ids: string[] = [];
        for (let guard = 0; ; guard++) {
          assert.ok(guard < 10000, "pagination must terminate");
          assert.ok(page.items.length <= PAGE_SIZE);
          ids.push(...page.items.map((item) => item.id));
          if (!page.next) break;
          const next = await fetchPage({ after: page.next });
          assert.ok(next.previous);
          const previous = await fetchPage({ before: next.previous });
          assert.deepEqual(
            previous.items.map((item) => item.id),
            page.items.map((item) => item.id),
          );
          page = next;
        }
        const expected = await sql.query<{ count: number }>(
          `SELECT count(*)::int AS count FROM ${table}`,
        );
        assert.equal(ids.length, expected.rows[0].count);
        assert.equal(
          new Set(ids).size,
          ids.length,
          "no duplicates across pages",
        );
        assert.equal(
          (await fetchPage({ search: "pagination-no-match-7b69f180" })).items
            .length,
          0,
        );
      }
      assert.equal((await getChildren({ mentorGroupIds: [] })).items.length, 0);
      const family = (await getFamilies()).items[0];
      if (family) {
        const matches = await getFamilies({ search: family.penpal_code });
        assert.ok(matches.items.some((item) => item.id === family.id));
      }
      const group = await sql.query<{ id: string; club_id: string }>(
        "SELECT id, club_id FROM groups LIMIT 1",
      );
      if (group.rows[0]) {
        const { id, club_id } = group.rows[0];
        const page = await getChildren({ groupId: id, clubId: club_id });
        assert.ok(page.items.every((item) => item.group_id === id));
        const scoped = await getChildren({ mentorGroupIds: [id] });
        assert.deepEqual(
          page.items.map((item) => item.id),
          scoped.items.map((item) => item.id),
        );
      }
    } finally {
      await sql.end();
    }
  },
);
