import assert from "node:assert/strict";
import test from "node:test";
import { NO_GROUP } from "../src/lib/children-filters";
import { sql } from "../src/lib/sql";
import { getOccurrenceDetail } from "../src/services/attendance/get-occurrence-detail";
import { getTodayActivities } from "../src/services/attendance/get-today-activities";
import { getWeekOccurrences } from "../src/services/attendance/get-week-occurrences";
import { markAttendance } from "../src/services/attendance/mark-attendance";
import { getChildren } from "../src/services/children/get-children";
import { CustomError } from "../src/utils/custom-error";

const id = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const mentor = { userId: "mentor-a", role: "mentor" as const };
const forbidden = (error: unknown) =>
  error instanceof CustomError && error.statusCode === 403;

test(
  "mentor roster and attendance respect group membership without a date restriction",
  { skip: !process.env.DB_HOST },
  async (t) => {
    const client = await sql.connect();
    const query = t.mock.method(sql, "query", client.query.bind(client));
    try {
      await client.query("BEGIN");
      for (const [table, columns] of Object.entries({
        clubs: "id uuid, name text",
        mentors: "id uuid, user_id text",
        groups: "id uuid, name text, club_id uuid, mentor_id uuid",
        children_groups: "child_id uuid, group_id uuid, active boolean",
        children: `id uuid, name text, gender text, birth_date date,
          family_id uuid, pamphlet_url text, child_photo_url text, notes text,
          created_at timestamp, updated_at timestamp`,
        families:
          "id uuid, penpal_code text, family_photo_url text, family_biography_url text",
        activities:
          "id uuid PRIMARY KEY, name text, description text, is_recurring boolean",
        activity_groups: "activity_id uuid, group_id uuid",
        activity_occurrences: `id uuid PRIMARY KEY, activity_id uuid, status text,
          start_datetime timestamp, end_datetime timestamp`,
        attendances: `id uuid DEFAULT gen_random_uuid(), child_id uuid,
          activity_occurrence_id uuid, status text, marked_at timestamp,
          UNIQUE (child_id, activity_occurrence_id)`,
      })) {
        await client.query(
          `CREATE TEMP TABLE ${table} (${columns}) ON COMMIT DROP`,
        );
      }

      await client.query("INSERT INTO clubs VALUES ($1, 'Club')", [id(1)]);
      await client.query(
        "INSERT INTO mentors VALUES ($1, 'mentor-a'), ($2, 'mentor-b')",
        [id(2), id(3)],
      );
      await client.query(
        "INSERT INTO groups VALUES ($1, 'Grupo A', $4, $5), ($2, 'Grupo B', $4, $6), ($3, 'Grupo C', $4, $5)",
        [id(4), id(5), id(6), id(1), id(2), id(3)],
      );
      await client.query(
        "INSERT INTO families VALUES ($1, '0010', 'https://example.com/photo', 'https://example.com/bio')",
        [id(10)],
      );
      await client.query(
        `INSERT INTO children (id, name, family_id) VALUES
          ($1, 'Ana', $6), ($2, 'Beto', $6), ($3, 'Clara', $6),
          ($4, 'Diana', $6), ($5, 'Elena', $6)`,
        [id(11), id(12), id(13), id(14), id(15), id(10)],
      );
      await client.query(
        `INSERT INTO children_groups VALUES
          ($1, $5, true), ($2, $6, true), ($3, $6, false),
          ($4, $7, true), ($4, $6, true)`,
        [id(11), id(12), id(13), id(15), id(4), id(5), id(6)],
      );
      await client.query("UPDATE children SET notes = 'Nota privada'");
      await client.query(
        "INSERT INTO activities (id, name, is_recurring) VALUES ($1, 'Taller', true), ($2, 'Visita', false)",
        [id(20), id(21)],
      );
      await client.query(
        "INSERT INTO activity_groups VALUES ($1, $3), ($1, $4), ($2, $4)",
        [id(20), id(21), id(4), id(5)],
      );
      await client.query(
        `INSERT INTO activity_occurrences VALUES
          ($1, $6, 'scheduled', '2000-01-01 08:00', '2000-01-01 09:00'),
          ($2, $6, 'scheduled', '2099-01-04 18:00', '2099-01-04 19:00'),
          ($3, $7, 'scheduled', '2000-01-01 10:00', '2000-01-01 11:00'),
          ($4, $6, 'cancelled', '2000-01-01 12:00', '2000-01-01 13:00'),
          ($5, $6, 'scheduled', CURRENT_DATE + TIME '07:00', CURRENT_DATE + TIME '08:00')`,
        [id(31), id(32), id(33), id(34), id(35), id(20), id(21)],
      );

      await t.test(
        "groupless includes inactive-only memberships and protects family data",
        async () => {
          const visible = await getChildren({ mentorGroupIds: [id(4), id(6)] });
          assert.deepEqual(
            visible.items.map((child) => child.id),
            [id(11), id(15), id(13), id(14)],
          );
          assert.equal(visible.items[0].penpal_code, "0010");
          assert.equal(visible.items[0].notes, "Nota privada");
          assert.equal(visible.items[1].group_id, id(6));
          for (const groupIds of [[id(4)], [id(5)], []]) {
            const { items } = await getChildren({
              groupId: NO_GROUP,
              mentorGroupIds: groupIds,
            });
            assert.deepEqual(
              items.map((child) => child.id),
              [id(13), id(14)],
            );
            for (const child of items) {
              assert.equal(child.group_id, null);
              assert.equal(child.family_id, null);
              assert.equal(child.penpal_code, null);
              assert.equal(child.family_photo_url, null);
              assert.equal(child.family_biography_url, null);
              assert.equal(child.notes, null);
            }
          }
          const search = await getChildren({
            search: "Clara",
            groupId: NO_GROUP,
            mentorGroupIds: [],
          });
          assert.deepEqual(
            search.items.map((child) => child.id),
            [id(13)],
          );
          assert.equal(
            (await getChildren({ mentorGroupIds: [id(4)], groupId: id(5) }))
              .items.length,
            0,
          );
          assert.equal(
            (await getChildren({ groupId: NO_GROUP })).items[0].penpal_code,
            "0010",
          );
        },
      );
      await t.test("Penpal search uses only visible family codes", async () => {
        const visible = await getChildren({
          search: "0010",
          mentorGroupIds: [id(4), id(6)],
        });
        assert.deepEqual(
          visible.items.map((child) => child.id),
          [id(11), id(15)],
        );
        assert.equal(
          (await getChildren({ search: "0010", mentorGroupIds: [] })).items
            .length,
          0,
        );
        assert.equal(
          (await getChildren({ search: "0010", groupId: NO_GROUP })).items
            .length,
          2,
        );
      });

      await t.test(
        "scheduled sessions can be marked on past, current and future dates",
        async () => {
          for (const occurrence of [31, 35, 32]) {
            const entry = { childId: id(11), occurrenceId: id(occurrence) };
            const created = await markAttendance(
              { ...entry, status: "present" },
              mentor,
            );
            assert.equal(created.status, "present");
            const updated = await markAttendance(
              { ...entry, status: "excused" },
              mentor,
            );
            assert.deepEqual(updated, { id: created.id, status: "excused" });
          }
          for (const [childId, occurrenceId] of [
            [12, 31], // Another mentor's child, even in a shared activity
            [13, 31], // Inactive membership
            [15, 31], // In the mentor's group, but participates through another group
            [11, 33], // Activity for another group
            [11, 34], // Cancelled
            [11, 99], // No scheduled occurrence
          ]) {
            await assert.rejects(
              markAttendance(
                {
                  childId: id(childId),
                  occurrenceId: id(occurrenceId),
                  status: "present",
                },
                mentor,
              ),
              forbidden,
            );
          }
        },
      );

      await t.test(
        "calendar and dashboard link to actual sessions within scope",
        async () => {
          const dates = { startDate: "2000-01-01", endDate: "2000-01-01" };
          const calendar = await getWeekOccurrences({
            ...dates,
            mentorGroupIds: [id(4)],
          });
          assert.deepEqual(
            calendar.map((entry) => entry.occurrence_id),
            [id(31)],
          );
          assert.deepEqual(
            await getWeekOccurrences({ ...dates, mentorGroupIds: [] }),
            [],
          );
          const dashboard = await getTodayActivities({
            date: dates.startDate,
            groupIds: [id(4)],
          });
          assert.deepEqual(
            dashboard.map((entry) => entry.occurrence_id),
            [id(31)],
          );
          assert.equal(
            (await getOccurrenceDetail(id(31)))?.start_datetime,
            "2000-01-01T08:00",
          );
          assert.equal(await getOccurrenceDetail(id(34)), null);
        },
      );
    } finally {
      query.mock.restore();
      await client.query("ROLLBACK");
      client.release();
      await sql.end();
    }
  },
);
