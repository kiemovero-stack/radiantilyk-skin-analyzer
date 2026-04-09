import fs from 'fs';

const BASE = 'http://localhost:3000';

async function run() {
  // Step 1: Upload photo
  console.log('=== Step 1: Upload photo ===');
  const fileBuffer = fs.readFileSync('/home/ubuntu/webdev-static-assets/acne-scar-test.jpg');
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('photos', blob, 'acne-scar-test.jpg');
  
  const uploadRes = await fetch(`${BASE}/api/client/upload-images`, {
    method: 'POST',
    body: form,
  });
  
  if (!uploadRes.ok) {
    console.error('Upload failed:', uploadRes.status, await uploadRes.text());
    return;
  }
  
  const uploadData = await uploadRes.json();
  console.log('Upload result:', JSON.stringify(uploadData, null, 2));
  
  const imageUrls = uploadData.uploadedImages.map(img => img.url);
  console.log('Image URLs:', imageUrls);

  // Step 2: Start analysis
  console.log('\n=== Step 2: Start analysis ===');
  const analyzeRes = await fetch(`${BASE}/api/client/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'ScarClient',
      email: 'kiemovero@gmail.com',
      dob: '1990-05-15',
      concerns: ['acne_scars', 'texture', 'pores'],
      imageUrls,
    }),
  });

  const analyzeData = await analyzeRes.json();
  console.log('Analysis started, ID:', analyzeData.id);
  const analysisId = analyzeData.id;

  // Step 3: Poll for completion
  console.log('\n=== Step 3: Polling for completion ===');
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const statusRes = await fetch(`${BASE}/api/client/status/${analysisId}`);
    const statusData = await statusRes.json();
    console.log(`Poll ${i + 1}: status = ${statusData.status}`);
    
    if (statusData.status === 'completed') {
      console.log('\n=== Analysis Complete! ===');
      
      // Step 4: Fetch the report
      const reportRes = await fetch(`${BASE}/api/client/report/${analysisId}`);
      const reportData = await reportRes.json();
      
      // Check for scar treatments
      const report = reportData.report;
      if (report.scarTreatments && report.scarTreatments.length > 0) {
        console.log('\n✅ SCAR TREATMENTS DETECTED:');
        report.scarTreatments.forEach((st, idx) => {
          console.log(`\n--- Scar Treatment #${idx + 1} ---`);
          console.log(`  Package: ${st.packageName}`);
          console.log(`  Scar Type: ${st.scarType}`);
          console.log(`  Price: $${st.price}`);
          console.log(`  Sessions: ${st.sessions}`);
          console.log(`  Includes: ${st.includes?.join(', ')}`);
          console.log(`  Savings: ${st.savings || 'N/A'}`);
          console.log(`  Timeline: ${st.totalTimeline || 'N/A'}`);
          console.log(`  Session Spacing: ${st.sessionSpacing || 'N/A'}`);
          console.log(`  First Results: ${st.firstResultsTimeline || 'N/A'}`);
          console.log(`  Treatment Explanations:`);
          if (st.treatmentExplanations) {
            st.treatmentExplanations.forEach(te => {
              console.log(`    - ${te.name}: ${te.description}`);
            });
          }
        });
      } else {
        console.log('\n❌ No scar treatments in report');
      }
      
      console.log(`\n📋 Report URL: ${BASE}/report/${analysisId}`);
      return;
    }
    
    if (statusData.status === 'error') {
      console.error('Analysis failed:', statusData.error);
      return;
    }
  }
  
  console.log('Timed out waiting for analysis');
}

run().catch(console.error);
