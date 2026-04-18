/**
 * Add location column to bookingStaff and seed 4 providers.
 */
import mysql from "mysql2/promise";

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }

  const conn = await mysql.createConnection(url);

  // 1. Add location column if not exists
  try {
    await conn.execute("ALTER TABLE `bookingStaff` ADD `location` varchar(256)");
    console.log("Added location column");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("location column already exists, skipping");
    } else {
      throw err;
    }
  }

  // 2. Seed providers (skip if email already exists)
  const providers = [
    { name: "Kamaren Manzano", email: "kamaren@radiantilyk.com", title: "RN", location: "San Jose" },
    { name: "Kiem Vukadinovic", email: "kiem@radiantilyk.com", title: "NP", location: "San Jose" },
    { name: "Donnie Nelson", email: "donnie@radiantilyk.com", title: "RN", location: "San Mateo" },
    { name: "Arpana Purani", email: "arpana@radiantilyk.com", title: "LE", location: "San Mateo" },
  ];

  for (const p of providers) {
    try {
      await conn.execute(
        "INSERT INTO `bookingStaff` (`name`, `email`, `title`, `location`, `isActive`) VALUES (?, ?, ?, ?, 1)",
        [p.name, p.email, p.title, p.location]
      );
      console.log(`Added provider: ${p.name} (${p.title}) — ${p.location}`);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        // Update existing provider with location
        await conn.execute(
          "UPDATE `bookingStaff` SET `title` = ?, `location` = ? WHERE `email` = ?",
          [p.title, p.location, p.email]
        );
        console.log(`Updated provider: ${p.name} (${p.title}) — ${p.location}`);
      } else {
        throw err;
      }
    }
  }

  await conn.end();
  console.log("Done!");
}

run().catch((err) => { console.error(err); process.exit(1); });
