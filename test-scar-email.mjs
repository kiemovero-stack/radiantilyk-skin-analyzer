/**
 * Test script to trigger the 24hr follow-up email immediately
 * with scar treatment data from the test analysis (ID: 660010).
 * 
 * This calls the server's internal API to send the email directly.
 */

// First, fetch the report data from the test analysis
const reportRes = await fetch("http://localhost:3000/api/client/report/660010");
if (!reportRes.ok) {
  console.error("Failed to fetch report:", reportRes.status);
  process.exit(1);
}

const reportData = await reportRes.json();
const report = reportData.report;

console.log("=== Report Data ===");
console.log("Patient:", reportData.patientFirstName, reportData.patientLastName);
console.log("Email:", reportData.patientEmail);
console.log("Score:", report.skinHealthScore);
console.log("Conditions:", report.conditions?.slice(0, 3).map(c => c.name));
console.log("Top procedure:", report.skinProcedures?.[0]?.name);
console.log("Scar treatments:", JSON.stringify(report.scarTreatments, null, 2));

// Now trigger the email via a test endpoint
const emailPayload = {
  analysisId: 660010,
  patientEmail: "kiemovero@gmail.com", // Send to Kiem for testing
  patientName: `${reportData.patientFirstName} ${reportData.patientLastName}`,
  skinHealthScore: report.skinHealthScore,
  topConcerns: report.conditions?.slice(0, 3).map(c => c.name) || [],
  topTreatment: report.skinProcedures?.[0]?.name || "a personalized treatment",
  scarTreatments: report.scarTreatments?.map(s => ({
    scarType: s.scarType,
    packageName: s.packageName,
    price: s.price,
    sessions: s.sessions,
    includes: s.includes,
  })) || [],
  emailType: "24hr", // or "72hr"
};

console.log("\n=== Sending test email ===");
console.log("Payload:", JSON.stringify(emailPayload, null, 2));

const sendRes = await fetch("http://localhost:3000/api/test-followup-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(emailPayload),
});

if (sendRes.ok) {
  const result = await sendRes.json();
  console.log("\n✅ Email sent successfully:", result);
} else {
  const error = await sendRes.text();
  console.error("\n❌ Failed to send email:", sendRes.status, error);
}
