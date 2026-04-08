/**
 * Test script: Run a client analysis with an acne scar image
 * to verify scar detection and treatment package recommendations.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE_URL = 'http://localhost:3000';

async function runTest() {
  console.log('=== SCAR DETECTION TEST ===\n');

  // Step 1: Upload the acne scar image
  console.log('Step 1: Uploading acne scar image...');
  const imagePath = '/home/ubuntu/webdev-static-assets/test-acne-scars.jpg';
  const imageBuffer = fs.readFileSync(imagePath);
  
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
  formData.append('images', blob, 'acne-scars-front.jpg');

  const uploadRes = await fetch(`${BASE_URL}/api/client/upload-images`, {
    method: 'POST',
    body: formData,
  });
  const uploadData = await uploadRes.json();
  console.log('Upload result:', JSON.stringify(uploadData, null, 2));

  if (!uploadData.uploadedImages || uploadData.uploadedImages.length === 0) {
    console.error('Upload failed!');
    process.exit(1);
  }

  // Step 2: Start analysis
  console.log('\nStep 2: Starting analysis...');
  const analyzeRes = await fetch(`${BASE_URL}/api/client/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientFirstName: 'Test',
      patientLastName: 'ScarPatient',
      patientEmail: 'test-scar@example.com',
      patientDob: '1990-05-15',
      skinConcerns: ['Acne Scars', 'Uneven Texture', 'Hyperpigmentation'],
      imageUrls: uploadData.uploadedImages,
    }),
  });
  const analyzeData = await analyzeRes.json();
  console.log('Analysis started, ID:', analyzeData.id);

  if (!analyzeData.id) {
    console.error('Analysis failed to start!');
    process.exit(1);
  }

  // Step 3: Poll for completion
  console.log('\nStep 3: Waiting for analysis to complete...');
  const analysisId = analyzeData.id;
  let status = 'processing';
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (status === 'processing' && attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 5000));
    attempts++;
    const statusRes = await fetch(`${BASE_URL}/api/client/status/${analysisId}`);
    const statusData = await statusRes.json();
    status = statusData.status;
    process.stdout.write(`  Poll ${attempts}: ${status}\r`);
  }
  console.log(`\n  Final status: ${status}`);

  if (status !== 'completed') {
    console.error('Analysis did not complete!');
    process.exit(1);
  }

  // Step 4: Get the report
  console.log('\nStep 4: Fetching report...');
  const reportRes = await fetch(`${BASE_URL}/api/client/report/${analysisId}`);
  const reportData = await reportRes.json();

  // Step 5: Check for scar treatments
  const report = reportData.report;
  console.log('\n=== REPORT SUMMARY ===');
  console.log('Skin Health Score:', report.skinHealthScore);
  console.log('Skin Type:', report.skinType);
  console.log('Fitzpatrick Type:', report.fitzpatrickType);
  
  console.log('\n--- Conditions Detected ---');
  report.conditions?.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.name} (${c.severity})`);
  });

  console.log('\n--- Skin Procedures ---');
  report.skinProcedures?.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} - ${p.price || 'no price'}`);
  });

  console.log('\n--- Facial Treatments ---');
  report.facialTreatments?.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name} - ${t.price || 'no price'}`);
  });

  console.log('\n=== SCAR TREATMENTS ===');
  if (report.scarTreatments && report.scarTreatments.length > 0) {
    report.scarTreatments.forEach((scar, i) => {
      console.log(`\n  Package ${i + 1}:`);
      console.log(`    Scar Type: ${scar.scarType}`);
      console.log(`    Package: ${scar.packageName}`);
      console.log(`    Price: ${scar.price}`);
      console.log(`    Sessions: ${scar.sessions}`);
      console.log(`    Savings: ${scar.savings || 'N/A'}`);
      console.log(`    Reason: ${scar.reason}`);
      console.log(`    Includes: ${scar.includes.join(', ')}`);
    });
    console.log('\n✅ SCAR TREATMENTS DETECTED AND RECOMMENDED!');
  } else {
    console.log('\n❌ NO SCAR TREATMENTS FOUND IN REPORT');
    console.log('This might mean the AI did not detect significant scarring.');
  }

  // Save full report for inspection
  fs.writeFileSync('/home/ubuntu/scar-test-report.json', JSON.stringify(report, null, 2));
  console.log('\nFull report saved to /home/ubuntu/scar-test-report.json');
  console.log(`\nView report at: ${BASE_URL}/report/${analysisId}`);
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
