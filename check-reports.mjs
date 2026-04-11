import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [cols] = await conn.execute("SHOW COLUMNS FROM skinAnalyses");
console.log("Columns:", cols.map(c => c.Field).join(', '));

const [rows] = await conn.execute('SELECT id, patientFirstName, patientLastName, imageUrl FROM skinAnalyses ORDER BY id');
console.log(`\nTotal reports: ${rows.length}`);
for (const r of rows) {
  console.log(`ID: ${r.id} | ${r.patientFirstName} ${r.patientLastName} | hasImage: ${r.imageUrl ? 'YES' : 'NO'}`);
}
await conn.end();
