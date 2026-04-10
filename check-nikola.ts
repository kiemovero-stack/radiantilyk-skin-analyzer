import mysql from "mysql2/promise";

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL as string);

  // Search for Nikola Velkov
  const [rows1] = await conn.query(
    "SELECT id, patientFirstName, patientLastName, patientEmail, status, leadScore, createdAt FROM skinAnalyses WHERE LOWER(patientFirstName) LIKE ? OR LOWER(patientLastName) LIKE ? ORDER BY createdAt DESC",
    ["%nikola%", "%velkov%"]
  );
  console.log("=== Nikola matches ===");
  console.log(JSON.stringify(rows1, null, 2));

  const [rows2] = await conn.query("SELECT COUNT(*) as total FROM skinAnalyses");
  console.log("\nTotal analyses:", JSON.stringify(rows2));

  const [rows3] = await conn.query(
    "SELECT id, patientFirstName, patientLastName, status, leadScore, createdAt FROM skinAnalyses ORDER BY createdAt DESC LIMIT 15"
  );
  console.log("\n=== Recent 15 ===");
  console.log(JSON.stringify(rows3, null, 2));

  await conn.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
