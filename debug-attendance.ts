import { sql } from "./src/lib/sql";
import * as fs from "fs";

async function debug() {
  const output: string[] = [];
  const log = (msg: string) => {
    output.push(msg);
    console.log(msg);
  };

  // Check today's date calculation
  const today = new Date();
  const targetDate = today.toISOString().split("T")[0];
  const dayOfWeek = today.getDay();
  const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const todayDayName = dayMap[dayOfWeek];

  log("=== DEBUG INFO ===");
  log(`Target Date: ${targetDate}`);
  log(`Day of Week (JS): ${dayOfWeek}`);
  log(`Day Name: ${todayDayName}`);

  // Check all activities
  log("\n=== ALL ACTIVITIES ===");
  const activities = await sql.query(
    "SELECT id, name, is_recurring FROM activities",
  );
  log(JSON.stringify(activities.rows, null, 2));

  // Check recurrences
  log("\n=== RECURRENCES ===");
  const recurrences = await sql.query(
    "SELECT activity_id, days_of_week, start_date, end_date, start_time, end_time FROM activity_recurrences",
  );
  log(JSON.stringify(recurrences.rows, null, 2));

  // Check if days_of_week matches
  log("\n=== MATCH TEST ===");
  const matchTest = await sql.query(
    `
    SELECT 
      a.name,
      ar.days_of_week,
      ar.start_date::text,
      ar.days_of_week LIKE '%' || $1 || '%' as day_matches,
      ar.start_date <= $2::date as start_date_ok
    FROM activities a
    INNER JOIN activity_recurrences ar ON ar.activity_id = a.id
  `,
    [todayDayName, targetDate],
  );
  log(JSON.stringify(matchTest.rows, null, 2));

  // Check activity_groups
  log("\n=== ACTIVITY_GROUPS ===");
  const activityGroups = await sql.query(`
    SELECT 
      a.name as activity_name,
      g.name as group_name,
      c.name as club_name
    FROM activity_groups ag
    INNER JOIN activities a ON a.id = ag.activity_id
    INNER JOIN groups g ON g.id = ag.group_id
    INNER JOIN clubs c ON c.id = g.club_id
  `);
  log(JSON.stringify(activityGroups.rows, null, 2));

  // Write output to file
  fs.writeFileSync("debug-output.txt", output.join("\n"));
  log("\n=== Output written to debug-output.txt ===");

  await sql.end();
}

debug().catch(console.error);
