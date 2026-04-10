/**
 * Re-run Jennifer Donnelly's analysis using her existing photos
 * to verify the updated scoring prompt produces accurate results.
 */
import 'dotenv/config';

// Find Jennifer's record and get her image URLs, then call the AI
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  
  // Find Jennifer Donnelly's analysis
  const [rows] = await conn.execute(
    `SELECT id, imageUrl, intakeData, report, skinHealthScore, status 
     FROM skinAnalyses 
     WHERE patientFirstName = 'Jennifer' AND patientLastName = 'Donnelly'
     ORDER BY id DESC LIMIT 1`
  );
  
  if (rows.length === 0) {
    console.log("Jennifer Donnelly not found in database");
    await conn.end();
    return;
  }
  
  const jennifer = rows[0];
  console.log(`Found Jennifer Donnelly (ID: ${jennifer.id})`);
  console.log(`Current score: ${jennifer.skinHealthScore}`);
  console.log(`Status: ${jennifer.status}`);
  console.log(`Image URL: ${jennifer.imageUrl}`);
  
  // Parse intake data to get concerns
  let intakeData = {};
  try {
    intakeData = typeof jennifer.intakeData === 'string' 
      ? JSON.parse(jennifer.intakeData) 
      : jennifer.intakeData || {};
  } catch (e) {
    console.log("Could not parse intakeData");
  }
  console.log(`Concerns: ${JSON.stringify(intakeData.concerns || intakeData.selectedConcerns || 'none found')}`);
  
  // Parse current report to see what conditions were detected
  let report = {};
  try {
    report = typeof jennifer.report === 'string'
      ? JSON.parse(jennifer.report)
      : jennifer.report || {};
  } catch (e) {
    console.log("Could not parse report");
  }
  
  if (report.conditions) {
    console.log(`\nCurrent conditions detected (${report.conditions.length}):`);
    report.conditions.forEach(c => {
      console.log(`  - ${c.name} (${c.severity}) — ${c.area}`);
    });
  }
  
  if (report.scoreCalculation) {
    console.log(`\nScore calculation: ${report.scoreCalculation}`);
  }
  
  // Now trigger a re-analysis via the dev server API
  console.log(`\n--- Triggering re-analysis via API ---`);
  
  const response = await fetch(`http://localhost:3000/api/client/reanalyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysisId: jennifer.id }),
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log("Re-analysis triggered:", data);
  } else {
    console.log(`Re-analysis endpoint not yet built (${response.status}). Will build it next.`);
    console.log("For now, let's check what data we have to work with.");
  }
  
  await conn.end();
}

main().catch(console.error);
