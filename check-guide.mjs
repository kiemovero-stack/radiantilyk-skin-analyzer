import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT id, patientFirstName, patientLastName, skinHealthScore, report FROM skinAnalyses WHERE id = 150001');
if (rows.length > 0) {
  const r = rows[0];
  const report = typeof r.report === 'string' ? JSON.parse(r.report || '{}') : (r.report || {});
  console.log('Patient:', r.patientFirstName, r.patientLastName);
  console.log('Score:', r.skinHealthScore);
  console.log('Has staffSummary:', !!report.staffSummary);
  if (report.staffSummary) {
    console.log('\n--- STAFF SUMMARY ---');
    console.log('Quick Overview:', report.staffSummary.quickOverview);
    console.log('Top Priority:', report.staffSummary.topPriorityConcern);
    console.log('Emotional State:', report.staffSummary.clientEmotionalState);
    console.log('Budget Approach:', report.staffSummary.budgetApproach);
    console.log('Closing Strategy:', report.staffSummary.closingStrategy);
    console.log('\n--- CONCERN ANALYSIS ---');
    if (report.staffSummary.concernAnalysis) {
      for (const c of report.staffSummary.concernAnalysis) {
        console.log('  Concern:', c.concern, '| Found:', c.whatWasFound);
      }
    } else {
      console.log('  (none)');
    }
    console.log('\n--- ANTICIPATED QUESTIONS ---');
    if (report.staffSummary.anticipatedQuestions) {
      for (const q of report.staffSummary.anticipatedQuestions) {
        console.log('  Q:', q.question);
        console.log('  A:', q.suggestedAnswer);
      }
    } else {
      console.log('  (none)');
    }
    console.log('\n--- EDUCATIONAL POINTS ---');
    if (report.staffSummary.educationalPoints) {
      for (const e of report.staffSummary.educationalPoints) {
        console.log('  Topic:', e.topic, '| Explanation:', e.simpleExplanation);
      }
    } else {
      console.log('  (none)');
    }
    console.log('\n--- TALKING POINTS ---');
    if (report.talkingPoints) {
      for (const t of report.talkingPoints) {
        console.log('  #' + t.order + ':', t.whatToSay);
      }
    }
  } else {
    console.log('staffSummary NOT generated yet - analysis may still be processing');
  }
}
await conn.end();
