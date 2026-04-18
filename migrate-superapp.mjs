import mysql from "mysql2/promise";
import fs from "fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await mysql.createConnection(url);

const tables = [
  "wallets", "walletTransactions", "products", "orders", "orderItems", "chatMessages", "flashDeals"
];

for (const t of tables) {
  const [rows] = await conn.execute(`SELECT COUNT(*) as c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`, [t]);
  if (rows[0].c > 0) {
    console.log(`Table ${t} already exists, skipping.`);
  } else {
    console.log(`Creating table ${t}...`);
  }
}

const sql = fs.readFileSync("/home/ubuntu/skin-analyzer/drizzle/0008_green_meteorite.sql", "utf8");
const statements = sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);

for (const stmt of statements) {
  const match = stmt.match(/CREATE TABLE `(\w+)`/);
  const tableName = match ? match[1] : "unknown";
  try {
    await conn.execute(stmt);
    console.log(`Created table: ${tableName}`);
  } catch (e) {
    if (e.code === "ER_TABLE_EXISTS_ERROR") {
      console.log(`Table ${tableName} already exists, skipping.`);
    } else {
      console.error(`Error creating ${tableName}:`, e.message);
    }
  }
}

console.log("Migration complete!");
await conn.end();
