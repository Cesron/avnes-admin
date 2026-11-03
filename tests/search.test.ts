import assert from "node:assert/strict";
import test from "node:test";
import { searchPattern } from "../src/lib/search";
import { sql } from "../src/lib/sql";
import { getChildren } from "../src/services/children/get-children";
import { getFamilies } from "../src/services/families/get-families";

test("search patterns ignore accents, case and surrounding whitespace", () => {
  for (const input of ["García", "GARCIA", "  garci\u0301a  "]) {
    assert.equal(searchPattern(input), "%garcia%");
  }
  assert.equal(searchPattern("Muñoz"), "%munoz%");
  assert.equal(searchPattern("Güéz"), "%guez%");
});

const id = (n: number) =>
  `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;

test(
  "children and families find accented and unaccented names in both directions",
  { skip: !process.env.DB_HOST },
  async (t) => {
    const fixtures = {
      children: [
        { id: id(1), family_id: id(11), name: "José García Muñoz" },
        { id: id(2), family_id: id(12), name: "Jose Garcia Munoz" },
        {
          id: id(3),
          family_id: id(13),
          name: "Jose\u0301 Garci\u0301a Mun\u0303oz",
        },
        { id: id(4), family_id: id(14), name: "Ana Rivera" },
      ],
      families: [11, 12, 13, 14].map((n) => ({
        id: id(n),
        penpal_code: String(n),
      })),
    };
    const definitions = {
      children:
        "id uuid, family_id uuid, name text, child_photo_url text, gender text",
      families:
        "id uuid, penpal_code text, family_biography_url text, family_photo_url text, created_at timestamp, updated_at timestamp",
      children_groups: "child_id uuid, group_id uuid, active boolean",
      groups: "id uuid, name text, club_id uuid",
      clubs: "id uuid, name text",
    };
    const execute = sql.query.bind(sql);
    // Shadow tables with read-only fixtures while executing the service SQL unchanged.
    const mocked = t.mock.method(
      sql,
      "query",
      async (query: string, values: unknown[]) => {
        const ctes = Object.entries(definitions)
          .map(
            ([name, fields]) =>
              `${name} AS (SELECT * FROM json_to_recordset($${values.length + 1}::json->'${name}') AS t(${fields}))`,
          )
          .join(", ");
        const body = query.trimStart();
        return execute(
          body.startsWith("WITH ")
            ? `WITH ${ctes}, ${body.slice(5)}`
            : `WITH ${ctes} ${body}`,
          [...values, JSON.stringify(fixtures)],
        );
      },
    );
    try {
      for (const search of [
        "garcia",
        "GARCÍA",
        "garci\u0301a",
        "  García  ",
        "jose",
        "JOSÉ",
        "munoz",
        "MUÑOZ",
      ]) {
        assert.deepEqual(
          (await getChildren({ search })).items.map((child) => child.id),
          [id(1), id(2), id(3)],
          `children: ${search}`,
        );
        assert.deepEqual(
          (await getFamilies({ search })).items.map((family) => family.id),
          [id(11), id(12), id(13)],
          `families: ${search}`,
        );
      }
      assert.deepEqual(
        (await getFamilies({ search: "14" })).items.map((family) => family.id),
        [id(14)],
      );
      assert.equal((await getChildren({ search: "missing" })).items.length, 0);
      assert.equal((await getFamilies({ search: "missing" })).items.length, 0);
      assert.equal((await getChildren({ search: "  " })).items.length, 4);
      assert.equal((await getFamilies({ search: "  " })).items.length, 4);
      assert.equal(
        (await getChildren({ search: "garcia", mentorGroupIds: [] })).items
          .length,
        0,
      );
    } finally {
      mocked.mock.restore();
      await sql.end();
    }
  },
);
