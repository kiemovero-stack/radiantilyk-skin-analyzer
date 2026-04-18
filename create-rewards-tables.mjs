import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

// Create rewardsMembers table
await conn.execute(`
  CREATE TABLE IF NOT EXISTS rewardsMembers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    name VARCHAR(256),
    points INT NOT NULL DEFAULT 0,
    lifetimePoints INT NOT NULL DEFAULT 0,
    tier ENUM('Glow', 'Radiant', 'Luminous', 'Icon') NOT NULL DEFAULT 'Glow',
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);
console.log("rewardsMembers table created");

// Create rewardsTransactions table
await conn.execute(`
  CREATE TABLE IF NOT EXISTS rewardsTransactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memberId INT NOT NULL,
    type ENUM('earn', 'redeem') NOT NULL,
    points INT NOT NULL,
    action VARCHAR(128) NOT NULL,
    description TEXT,
    referenceId VARCHAR(128),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log("rewardsTransactions table created");

await conn.end();
process.exit(0);
