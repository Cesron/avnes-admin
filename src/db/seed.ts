import { Pool } from "pg";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// ==========================================
// Configuración de la conexión
// ==========================================
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ==========================================
// Utilidades
// ==========================================

/**
 * Convierte valores "N/A" a null
 */
function normalizeValue(value: unknown): unknown {
  if (value === "N/A") return null;
  return value;
}

/**
 * Lee un archivo JSON de source-data
 */
function readJsonFile<T>(filename: string): T {
  const filePath = join(__dirname, "source-data", filename);
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T;
}

// ==========================================
// Tipos de datos
// ==========================================

interface Club {
  id: string;
  name: string;
}

interface Mentor {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Family {
  id: string;
  penpal_code: string;
  family_biography_url: string | null;
  family_photo_url: string | null;
}

interface Group {
  id: string;
  name: string;
  club_id: string;
  mentor_id: string;
}

interface Child {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  family_id: string | null;
  pamphlet_url: string | null;
  child_photo_url: string | null;
}

interface ChildGroup {
  child_id: string;
  group_id: string;
  active: boolean;
}

// ==========================================
// Funciones de inserción
// ==========================================

async function clearTables(client: Pool) {
  console.log("🗑️  Limpiando tablas...");

  // Orden inverso por dependencias
  await client.query("DELETE FROM children_groups");
  await client.query("DELETE FROM children");
  await client.query("DELETE FROM groups");
  await client.query("DELETE FROM families");
  await client.query("DELETE FROM mentors");
  await client.query("DELETE FROM clubs");

  console.log("✅ Tablas limpiadas");
}

async function seedClubs(client: Pool) {
  const clubs = readJsonFile<Club[]>("clubs-data.json");
  console.log(`📦 Insertando ${clubs.length} clubs...`);

  for (const club of clubs) {
    await client.query("INSERT INTO clubs (id, name) VALUES ($1, $2)", [
      club.id,
      club.name,
    ]);
  }

  console.log("✅ Clubs insertados");
}

async function seedMentors(client: Pool) {
  const mentors = readJsonFile<Mentor[]>("mentors-data.json");
  console.log(`👩‍🏫 Insertando ${mentors.length} mentors...`);

  for (const mentor of mentors) {
    await client.query(
      "INSERT INTO mentors (id, name, phone, email) VALUES ($1, $2, $3, $4)",
      [
        mentor.id,
        mentor.name,
        normalizeValue(mentor.phone),
        normalizeValue(mentor.email),
      ]
    );
  }

  console.log("✅ Mentors insertados");
}

async function seedFamilies(client: Pool) {
  const families = readJsonFile<Family[]>("families-data.json");
  console.log(`👨‍👩‍👧‍👦 Insertando ${families.length} families...`);

  for (const family of families) {
    await client.query(
      `INSERT INTO families (id, penpal_code, family_biography_url, family_photo_url)
       VALUES ($1, $2, $3, $4)`,
      [
        family.id,
        family.penpal_code,
        normalizeValue(family.family_biography_url),
        normalizeValue(family.family_photo_url),
      ]
    );
  }

  console.log("✅ Families insertadas");
}

async function seedGroups(client: Pool) {
  const groups = readJsonFile<Group[]>("groups-data.json");
  console.log(`👥 Insertando ${groups.length} groups...`);

  for (const group of groups) {
    await client.query(
      "INSERT INTO groups (id, name, club_id, mentor_id) VALUES ($1, $2, $3, $4)",
      [group.id, group.name, group.club_id, group.mentor_id]
    );
  }

  console.log("✅ Groups insertados");
}

async function seedChildren(client: Pool) {
  const children = readJsonFile<Child[]>("children-data.json");
  console.log(`👶 Insertando ${children.length} children...`);

  for (const child of children) {
    await client.query(
      `INSERT INTO children (id, name, gender, birth_date, family_id, pamphlet_url, child_photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        child.id,
        child.name,
        child.gender,
        child.birth_date,
        normalizeValue(child.family_id),
        normalizeValue(child.pamphlet_url),
        normalizeValue(child.child_photo_url),
      ]
    );
  }

  console.log("✅ Children insertados");
}

async function seedChildrenGroups(client: Pool) {
  const childrenGroups = readJsonFile<ChildGroup[]>(
    "children-groups-data.json"
  );
  console.log(`🔗 Insertando ${childrenGroups.length} children_groups...`);

  let inserted = 0;
  let skipped = 0;

  for (const cg of childrenGroups) {
    // Saltar registros con UUIDs vacíos o inválidos
    if (!cg.child_id || !cg.group_id || cg.child_id === "" || cg.group_id === "") {
      skipped++;
      continue;
    }

    await client.query(
      "INSERT INTO children_groups (child_id, group_id, active) VALUES ($1, $2, $3)",
      [cg.child_id, cg.group_id, cg.active]
    );
    inserted++;
  }

  console.log(`✅ Children_groups insertados (${inserted} insertados, ${skipped} saltados por datos inválidos)`);
}

// ==========================================
// Función principal
// ==========================================

async function seed() {
  console.log("🚀 Iniciando seed de la base de datos...\n");

  try {
    // Limpiar tablas existentes
    await clearTables(pool);
    console.log("");

    // Insertar en orden de dependencias
    // 1. Tablas sin dependencias
    await seedClubs(pool);
    await seedMentors(pool);
    await seedFamilies(pool);

    // 2. Tablas con dependencias de primer nivel
    await seedGroups(pool);
    await seedChildren(pool);

    // 3. Tablas con dependencias de segundo nivel
    await seedChildrenGroups(pool);

    console.log("\n🎉 Seed completado exitosamente!");
  } catch (error) {
    console.error("\n❌ Error durante el seed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar
seed();
