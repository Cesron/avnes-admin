import assert from "node:assert/strict";
import test from "node:test";
import { editFamilySchema } from "../src/app/(main)/families/_lib/edit-family.schema";
import { PAGE_SIZE } from "../src/lib/pagination";
import { getAllowedRoutes, hasAccess } from "../src/lib/permissions";
import { sql } from "../src/lib/sql";
import { getFamilies } from "../src/services/families/get-families";
import { getFamiliesOptions } from "../src/services/families/get-families-options";
import { updateFamily } from "../src/services/families/update-family";
import type { UserRole } from "../src/types/user";
import { CustomError } from "../src/utils/custom-error";

const id = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const penpal = (n: number) => String(n).padStart(4, "0");
const mentor = { userId: "mentor-a", role: "mentor" as const };
const edit = (n: number) => ({
  id: id(n),
  penpalCode: penpal(n),
  familyBiographyUrl: "https://example.com/biography",
  familyPhotoUrl: "https://example.com/photo.jpg",
});
const status = (code: number) => (error: unknown) =>
  error instanceof CustomError && error.statusCode === code;

test("mentors can navigate to families without gaining other admin routes", () => {
  assert.ok(hasAccess("mentor", "/families"));
  assert.ok(hasAccess("mentor", "/families/example"));
  assert.ok(getAllowedRoutes("mentor")?.includes("/families"));
  assert.equal(hasAccess("mentor", "/families-other"), false);
  assert.equal(hasAccess("mentor", "/users"), false);
  assert.equal(hasAccess("mentor", "/mentors"), false);
  assert.equal(hasAccess(null, "/families"), false);
  assert.ok(hasAccess("admin", "/families"));
  assert.ok(hasAccess("coordinator", "/families"));
});

test("family edits reject malformed IDs and users without a permitted role", async () => {
  assert.equal(
    editFamilySchema.safeParse({ ...edit(1), id: "invalid" }).success,
    false,
  );
  assert.ok(editFamilySchema.safeParse(edit(1)).success);
  await assert.rejects(
    updateFamily(edit(1), { userId: "unassigned", role: null }),
    status(403),
  );
});

test(
  "family permissions use active membership for reads and writes",
  { skip: !process.env.DB_HOST },
  async (t) => {
    const client = await sql.connect();
    let beforeUpdate: (() => Promise<void>) | undefined;
    // All mutations run against connection-local temporary tables, then roll back.
    // No real families, children, groups, mentors or users are changed.
    const mocked = t.mock.method(
      sql,
      "query",
      async (query: string, values?: unknown[]) => {
        if (query.trimStart().startsWith("UPDATE families") && beforeUpdate) {
          const hook = beforeUpdate;
          beforeUpdate = undefined;
          await hook();
        }
        return client.query(query, values);
      },
    );
    try {
      await client.query("BEGIN");
      for (const [name, fields] of Object.entries({
        families: `id uuid PRIMARY KEY, penpal_code char(4) UNIQUE,
          family_biography_url text, family_photo_url text,
          created_at timestamp DEFAULT NOW(), updated_at timestamp DEFAULT NOW()`,
        children:
          "id uuid PRIMARY KEY, family_id uuid, name text, child_photo_url text, gender text",
        mentors: "id uuid PRIMARY KEY, user_id text",
        groups: "id uuid PRIMARY KEY, mentor_id uuid",
        children_groups: "child_id uuid, group_id uuid, active boolean",
      })) {
        await client.query(
          `CREATE TEMP TABLE ${name} (${fields}) ON COMMIT DROP`,
        );
      }
      const fixture = {
        families: Array.from({ length: PAGE_SIZE + 4 }, (_, i) => ({
          id: id(i + 1),
          penpal_code: penpal(i + 1),
        })),
        children: [
          ...Array.from({ length: PAGE_SIZE + 3 }, (_, i) => ({
            id: id(101 + i),
            family_id: id(i + 1),
            name: `Niño ${i + 1} García`,
          })),
          { id: id(1000), family_id: id(1), name: "Hermana Rivera" },
        ],
        mentors: ["mentor-a", "mentor-b", "mentor-empty", "mentor-idle"].map(
          (user_id, i) => ({ id: id(201 + i), user_id }),
        ),
        groups: [201, 202, 201, 204].map((mentorId, i) => ({
          id: id(301 + i),
          mentor_id: id(mentorId),
        })),
        children_groups: [
          ...Array.from({ length: PAGE_SIZE + 3 }, (_, i) => ({
            child_id: id(101 + i),
            group_id: id(i === PAGE_SIZE + 1 ? 302 : 301),
            active: i !== PAGE_SIZE + 2,
          })),
          { child_id: id(101), group_id: id(303), active: true },
          { child_id: id(1000), group_id: id(302), active: true },
        ],
      };
      for (const [table, rows] of Object.entries(fixture)) {
        const fields = Object.keys(rows[0]);
        await client.query(
          `INSERT INTO ${table} (${fields.join(", ")})
           SELECT ${fields.join(", ")} FROM json_populate_recordset(NULL::pg_temp.${table}, $1::json)`,
          [JSON.stringify(rows)],
        );
      }

      await t.test(
        "search, summaries, options and both page directions stay in scope",
        async () => {
          const first = await getFamilies({ mentorUserId: mentor.userId });
          assert.equal(first.items.length, PAGE_SIZE);
          assert.equal(first.previous, null);
          assert.ok(first.next);
          const second = await getFamilies({
            mentorUserId: mentor.userId,
            after: first.next,
          });
          assert.deepEqual(
            second.items.map((row) => row.id),
            [id(PAGE_SIZE + 1)],
          );
          assert.equal(second.next, null);
          assert.ok(second.previous);
          const previous = await getFamilies({
            mentorUserId: mentor.userId,
            before: second.previous,
          });
          assert.deepEqual(
            previous.items.map((row) => row.id),
            first.items.map((row) => row.id),
          );
          assert.equal(first.items[0].children_count, 1);
          assert.deepEqual(
            first.items[0].children.map((child) => child.id),
            [id(101)],
          );
          assert.equal(first.items[0].first_child_name, "Niño 1 García");
          assert.equal(first.items[0].children_names, "Niño 1 García");
          const options = await getFamiliesOptions(mentor.userId);
          assert.deepEqual(
            options.map((row) => row.id),
            Array.from({ length: PAGE_SIZE + 1 }, (_, i) => id(i + 1)),
          );
          assert.equal(
            (
              await getFamilies({
                mentorUserId: mentor.userId,
                search: "rivera",
              })
            ).items.length,
            0,
          );
          assert.equal(
            (
              await getFamilies({
                mentorUserId: mentor.userId,
                search: penpal(PAGE_SIZE + 2),
              })
            ).items.length,
            0,
          );
          assert.ok(
            (
              await getFamilies({
                mentorUserId: mentor.userId,
                search: "GARCÍA",
              })
            ).items.length,
          );
          const otherMentor = await getFamilies({
            mentorUserId: "mentor-b",
            search: "rivera",
          });
          assert.deepEqual(
            otherMentor.items.map((row) => row.id),
            [id(1)],
          );
          assert.deepEqual(
            otherMentor.items[0].children.map((child) => child.id),
            [id(1000)],
          );
          assert.equal((await getFamiliesOptions()).length, PAGE_SIZE + 4);
          const unscoped = await getFamilies({ search: penpal(1) });
          assert.equal(unscoped.items[0].children_count, 2);
          assert.deepEqual(
            (await getFamilies({ search: "rivera" })).items.map(
              (row) => row.id,
            ),
            [id(1)],
          );
          const foreignCursor = Buffer.from(
            JSON.stringify({
              key: penpal(PAGE_SIZE + 4),
              id: id(PAGE_SIZE + 4),
            }),
          ).toString("base64url");
          const forged = await getFamilies({
            mentorUserId: mentor.userId,
            before: foreignCursor,
          });
          assert.ok(
            forged.items.every((row) =>
              options.some((option) => option.id === row.id),
            ),
          );
        },
      );

      await t.test(
        "unlinked, groupless and childless mentors get no families",
        async () => {
          for (const mentorUserId of [
            "unlinked",
            "mentor-empty",
            "mentor-idle",
            "",
          ]) {
            assert.deepEqual(await getFamilies({ mentorUserId }), {
              items: [],
              previous: null,
              next: null,
            });
            assert.deepEqual(await getFamiliesOptions(mentorUserId), []);
            await assert.rejects(
              updateFamily(edit(1), { userId: mentorUserId, role: "mentor" }),
              status(403),
            );
          }
        },
      );

      await t.test(
        "mentors edit or clear resources on shared families while preserving the code",
        async () => {
          const family = await updateFamily(edit(1), mentor);
          assert.equal(family.family_biography_url, edit(1).familyBiographyUrl);
          assert.equal(family.family_photo_url, edit(1).familyPhotoUrl);
          assert.equal(family.penpal_code, penpal(1));
          const cleared = await updateFamily(
            { ...edit(1), familyBiographyUrl: "", familyPhotoUrl: "" },
            { userId: "mentor-b", role: "mentor" },
          );
          assert.equal(cleared.family_biography_url, null);
          assert.equal(cleared.family_photo_url, null);
          assert.equal(cleared.penpal_code, penpal(1));
        },
      );

      await t.test(
        "direct edits of other families, inactive memberships and penpal codes fail",
        async () => {
          await assert.rejects(
            updateFamily({ ...edit(1), penpalCode: "9999" }, mentor),
            status(403),
          );
          for (const n of [
            PAGE_SIZE + 2,
            PAGE_SIZE + 3,
            PAGE_SIZE + 4,
            999999,
          ]) {
            await assert.rejects(updateFamily(edit(n), mentor), status(403));
          }
          const unchanged = await client.query(
            "SELECT penpal_code, family_photo_url FROM families WHERE id = $1",
            [id(1)],
          );
          assert.equal(unchanged.rows[0].penpal_code, penpal(1));
          assert.equal(unchanged.rows[0].family_photo_url, null);
        },
      );

      await t.test(
        "administrators and coordinators retain full edits and duplicate validation",
        async () => {
          for (const [role, n, code] of [
            ["admin", 2, "9002"],
            ["coordinator", PAGE_SIZE + 2, "9026"],
          ] as const) {
            const family = await updateFamily(
              { ...edit(n), penpalCode: code },
              { userId: "staff", role },
            );
            assert.equal(family.penpal_code, code);
            assert.equal(family.family_photo_url, edit(n).familyPhotoUrl);
          }
          await assert.rejects(
            updateFamily(
              { ...edit(3), penpalCode: "9002" },
              { userId: "staff", role: "admin" },
            ),
            status(400),
          );
          await assert.rejects(
            updateFamily(edit(999999), {
              userId: "staff",
              role: "coordinator",
            }),
            status(404),
          );
          await assert.rejects(
            updateFamily(edit(1), {
              userId: "staff",
              role: "unexpected" as UserRole,
            }),
            status(403),
          );
        },
      );

      await t.test(
        "a concurrent penpal change is preserved when a mentor saves a stale form",
        async () => {
          beforeUpdate = async () => {
            await client.query(
              "UPDATE families SET penpal_code = $1 WHERE id = $2",
              ["9001", id(1)],
            );
          };
          await assert.rejects(updateFamily(edit(1), mentor), status(403));
          const unchanged = await client.query(
            "SELECT penpal_code, family_photo_url FROM families WHERE id = $1",
            [id(1)],
          );
          assert.equal(unchanged.rows[0].penpal_code, "9001");
          assert.equal(unchanged.rows[0].family_photo_url, null);
          await client.query(
            "UPDATE families SET penpal_code = $1 WHERE id = $2",
            [penpal(1), id(1)],
          );
        },
      );

      await t.test(
        "revoked membership between opening and saving cannot authorize a write",
        async () => {
          beforeUpdate = async () => {
            await client.query(
              "UPDATE children_groups SET active = false WHERE child_id = $1",
              [id(101)],
            );
          };
          await assert.rejects(updateFamily(edit(1), mentor), status(403));
          const unchanged = await client.query(
            "SELECT penpal_code, family_photo_url FROM families WHERE id = $1",
            [id(1)],
          );
          assert.equal(unchanged.rows[0].penpal_code, penpal(1));
          assert.equal(unchanged.rows[0].family_photo_url, null);
          assert.equal(
            (
              await getFamilies({
                mentorUserId: mentor.userId,
                search: penpal(1),
              })
            ).items.length,
            0,
          );
        },
      );
    } finally {
      mocked.mock.restore();
      await client.query("ROLLBACK");
      client.release();
      await sql.end();
    }
  },
);
