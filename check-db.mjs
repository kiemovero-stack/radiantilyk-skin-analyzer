import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { desc } from 'drizzle-orm';
import { int, json, mysqlTable, text, timestamp, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';

const skinAnalyses = mysqlTable("skinAnalyses", {
  id: int("id").autoincrement().primaryKey(),
  patientFirstName: varchar("patientFirstName", { length: 128 }),
  patientEmail: varchar("patientEmail", { length: 320 }),
  status: varchar("status", { length: 32 }),
  agingImages: json("agingImages"),
  simulationImages: json("simulationImages"),
  skinHealthScore: int("skinHealthScore"),
  createdAt: timestamp("createdAt"),
});

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("No DATABASE_URL");
    process.exit(1);
  }
  
  const connection = await mysql.createConnection(url);
  const db = drizzle(connection);
  
  const results = await db
    .select({
      id: skinAnalyses.id,
      patientFirstName: skinAnalyses.patientFirstName,
      patientEmail: skinAnalyses.patientEmail,
      status: skinAnalyses.status,
      skinHealthScore: skinAnalyses.skinHealthScore,
      agingImages: skinAnalyses.agingImages,
      simulationImages: skinAnalyses.simulationImages,
      createdAt: skinAnalyses.createdAt,
    })
    .from(skinAnalyses)
    .orderBy(desc(skinAnalyses.id))
    .limit(5);
  
  for (const r of results) {
    const agingKeys = r.agingImages ? Object.keys(r.agingImages) : [];
    const simKeys = r.simulationImages ? Object.keys(r.simulationImages) : [];
    console.log(`ID: ${r.id} | Name: ${r.patientFirstName} | Score: ${r.skinHealthScore} | Status: ${r.status} | Aging: [${agingKeys.join(',')}] | Sim: [${simKeys.join(',')}] | Created: ${r.createdAt}`);
  }
  
  await connection.end();
}

main().catch(console.error);
