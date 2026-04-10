import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  // Search for Nikola in skin_analyses
  const res1 = await pool.query(`SELECT id, patient_name, patient_email, status, created_at, source FROM skin_analyses WHERE LOWER(patient_name) LIKE '%nikola%' OR LOWER(patient_name) LIKE '%velkov%' ORDER BY created_at DESC`);
  console.log("=== skin_analyses matches ===");
  console.log(JSON.stringify(res1.rows, null, 2));
  
  // Also check total count and recent entries
  const res2 = await pool.query(`SELECT COUNT(*) as total FROM skin_analyses`);
  console.log("\n=== Total analyses ===", res2.rows[0].total);
  
  const res3 = await pool.query(`SELECT id, patient_name, status, source, created_at FROM skin_analyses ORDER BY created_at DESC LIMIT 10`);
  console.log("\n=== Recent 10 analyses ===");
  console.log(JSON.stringify(res3.rows, null, 2));
  
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
