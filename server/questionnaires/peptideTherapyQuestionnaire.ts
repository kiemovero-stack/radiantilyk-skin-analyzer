import PDFDocument from "pdfkit";

const CLINIC_NAME = "RADIANTILYK AESTHETIC";
const PROVIDER = "Kiem Vukadinovic, NP";
const LOCATIONS = [
  "San Mateo: 1528 S El Camino Real, San Mateo, Unit 200",
  "San Jose: 2100 Curtner Ave, Unit 1B, San Jose, CA 95124",
];

/**
 * Generate a litigation-tight Peptide Therapy Intake Questionnaire & Consent Form.
 * California-compliant, extremely detailed, legally defensible.
 */
export async function generatePeptideTherapyQuestionnaire(
  patientName?: string,
  patientDob?: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 60, left: 50, right: 50 },
        bufferPages: true,
        info: {
          Title: "Peptide Therapy Intake Questionnaire & Informed Consent",
          Author: CLINIC_NAME,
          Subject: "Peptide Therapy Medical Intake",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - 100;
      const checkBox = "☐ ";
      const lineHeight = 14;

      // ─── HEADER ───
      doc.fontSize(18).font("Helvetica-Bold").text(CLINIC_NAME, { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(9).font("Helvetica").text(LOCATIONS[0], { align: "center" });
      doc.text(LOCATIONS[1], { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(14).font("Helvetica-Bold").fillColor("#4B0082")
        .text("PEPTIDE THERAPY INTAKE QUESTIONNAIRE", { align: "center" });
      doc.fontSize(11).fillColor("#4B0082")
        .text("& INFORMED CONSENT", { align: "center" });
      doc.fillColor("black");
      doc.moveDown(0.3);
      doc.fontSize(8).font("Helvetica-Oblique").fillColor("#666")
        .text("This document is confidential and protected under HIPAA. All information is used solely for medical treatment purposes.", { align: "center" });
      doc.fillColor("black");
      doc.moveDown(0.5);

      // Horizontal line
      doc.moveTo(50, doc.y).lineTo(pageWidth + 50, doc.y).stroke();
      doc.moveDown(0.5);

      // ─── SECTION 1: PATIENT INFORMATION ───
      sectionHeader(doc, "SECTION 1: PATIENT INFORMATION");
      const fields1 = [
        "Full Legal Name: " + (patientName || "___________________________________"),
        "Date of Birth: " + (patientDob || "____/____/________") + "     Age: ________     Sex at Birth:  ☐ Male  ☐ Female  ☐ Other",
        "Preferred Pronouns: ☐ He/Him  ☐ She/Her  ☐ They/Them  ☐ Other: __________",
        "Address: _______________________________________________________________",
        "City: _________________________ State: _______ ZIP: ___________",
        "Phone: _________________________ Email: ________________________________",
        "Emergency Contact: _________________________ Phone: ____________________",
        "Relationship to Emergency Contact: ______________________________________",
        "Primary Care Physician: _________________________ Phone: ________________",
        "Referring Provider (if any): ____________________________________________",
        "Preferred Pharmacy Name & Address: ______________________________________",
      ];
      fields1.forEach(f => { doc.fontSize(9).font("Helvetica").text(f); doc.moveDown(0.3); });
      doc.moveDown(0.3);

      // ─── SECTION 2: REASON FOR VISIT ───
      sectionHeader(doc, "SECTION 2: REASON FOR SEEKING PEPTIDE THERAPY");
      doc.fontSize(9).font("Helvetica").text("Please check ALL that apply:");
      doc.moveDown(0.2);
      const reasons = [
        "Anti-aging / skin rejuvenation",
        "Tissue repair / injury recovery",
        "Gut health / digestive issues",
        "Immune system support",
        "Improved sleep quality",
        "Increased energy / reduced fatigue",
        "Lean muscle development / body composition",
        "Fat loss / metabolic optimization",
        "Hair growth / hair thinning",
        "Joint pain / inflammation",
        "Cognitive function / brain fog",
        "Sexual health / libido",
        "Post-surgical healing",
        "Athletic performance / recovery",
        "General wellness optimization",
        "Other (please describe): ____________________________________________",
      ];
      reasons.forEach(r => { doc.text(checkBox + r, { indent: 10 }); doc.moveDown(0.15); });
      doc.moveDown(0.2);
      doc.text("Please describe your primary goals for peptide therapy in detail:");
      doc.moveDown(0.2);
      doc.text("________________________________________________________________________");
      doc.text("________________________________________________________________________");
      doc.moveDown(0.3);

      // ─── SECTION 3: MEDICAL HISTORY ───
      doc.addPage();
      sectionHeader(doc, "SECTION 3: COMPREHENSIVE MEDICAL HISTORY");
      doc.fontSize(9).font("Helvetica").text("Do you currently have or have you ever been diagnosed with any of the following? Check ALL that apply:");
      doc.moveDown(0.2);
      const conditions = [
        "Diabetes (Type 1 or Type 2)", "Hypertension (high blood pressure)", "Heart disease / cardiovascular disease",
        "Stroke or TIA (mini-stroke)", "Blood clotting disorders (DVT, PE, Factor V Leiden)",
        "Cancer (any type) — Type: _____________________ Year diagnosed: _______",
        "Autoimmune disease (lupus, rheumatoid arthritis, MS, etc.) — Type: _______________",
        "Thyroid disorder (hypo/hyperthyroidism, Hashimoto's, Graves')",
        "Kidney disease or impaired kidney function", "Liver disease (hepatitis, cirrhosis, fatty liver)",
        "Gastrointestinal disorders (Crohn's, ulcerative colitis, IBS, GERD)",
        "Respiratory conditions (asthma, COPD)", "Neurological conditions (seizures, neuropathy, Parkinson's)",
        "Psychiatric conditions (depression, anxiety, bipolar, PTSD)",
        "HIV/AIDS or other immunodeficiency", "Chronic infections",
        "Bleeding disorders or easy bruising", "Anemia or blood disorders",
        "Hormone imbalances (specify): _______________________________________",
        "Allergies to medications, foods, or environmental factors — List: _______________",
        "Latex allergy", "History of anaphylaxis",
        "Pregnant, planning pregnancy, or currently breastfeeding",
        "History of organ transplant", "History of keloid or hypertrophic scarring",
      ];
      conditions.forEach(c => { doc.text(checkBox + c, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.2);
      doc.text("Please list any other medical conditions not mentioned above:");
      doc.text("________________________________________________________________________");
      doc.moveDown(0.3);

      // ─── SECTION 4: SURGICAL HISTORY ───
      sectionHeader(doc, "SECTION 4: SURGICAL HISTORY");
      doc.fontSize(9).font("Helvetica").text("Please list ALL surgeries, including dates and any complications:");
      doc.moveDown(0.2);
      for (let i = 0; i < 4; i++) {
        doc.text(`Surgery ${i + 1}: _________________________ Date: _________ Complications: _____________`);
        doc.moveDown(0.15);
      }
      doc.moveDown(0.3);

      // ─── SECTION 5: CURRENT MEDICATIONS ───
      doc.addPage();
      sectionHeader(doc, "SECTION 5: CURRENT MEDICATIONS & SUPPLEMENTS");
      doc.fontSize(9).font("Helvetica")
        .text("List ALL current medications (prescription, over-the-counter, supplements, vitamins, herbal remedies):");
      doc.moveDown(0.2);
      doc.fontSize(8).font("Helvetica-Bold")
        .text("Medication Name          Dose          Frequency          Reason          Prescribing Provider");
      doc.font("Helvetica");
      for (let i = 0; i < 6; i++) {
        doc.text("_____________________________________________________________________________");
        doc.moveDown(0.15);
      }
      doc.moveDown(0.2);
      doc.fontSize(9).text("Are you currently taking any of the following? Check ALL that apply:");
      const meds = [
        "Blood thinners (Warfarin, Eliquis, Xarelto, aspirin)",
        "Immunosuppressants (methotrexate, cyclosporine, biologics)",
        "Corticosteroids (prednisone, dexamethasone)",
        "Growth hormone or growth hormone-releasing peptides",
        "Testosterone or other hormone replacement therapy",
        "Insulin or other diabetes medications",
        "Chemotherapy or targeted cancer therapy",
        "Antibiotics (current course)",
        "NSAIDs (ibuprofen, naproxen) — frequency: ___________",
        "Other peptide therapies (specify): ___________________________________",
      ];
      meds.forEach(m => { doc.text(checkBox + m, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.3);

      // ─── SECTION 6: ALLERGY ASSESSMENT ───
      sectionHeader(doc, "SECTION 6: ALLERGY & ADVERSE REACTION ASSESSMENT");
      doc.fontSize(9).font("Helvetica")
        .text("Have you ever had an allergic or adverse reaction to any of the following?");
      doc.moveDown(0.2);
      const allergies = [
        "Peptide-based medications or supplements",
        "Injectable medications of any kind",
        "Preservatives (benzyl alcohol, phenol, metacresol)",
        "Mannitol or other sugar alcohols",
        "Bacteriostatic water or sterile water",
        "Any amino acid supplements",
        "Latex or adhesive tape",
        "Topical antiseptics (alcohol, chlorhexidine, betadine)",
      ];
      allergies.forEach(a => { doc.text(checkBox + a, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.2);
      doc.text("If yes to any of the above, please describe the reaction:");
      doc.text("________________________________________________________________________");
      doc.moveDown(0.3);

      // ─── SECTION 7: LIFESTYLE ───
      sectionHeader(doc, "SECTION 7: LIFESTYLE & SOCIAL HISTORY");
      const lifestyle = [
        "Do you smoke or use tobacco products?  ☐ Yes  ☐ No  ☐ Former — Quit date: _______",
        "Do you consume alcohol?  ☐ No  ☐ Occasionally  ☐ Moderately  ☐ Heavily — Drinks/week: ____",
        "Do you use recreational drugs?  ☐ Yes  ☐ No — If yes, specify: _______________",
        "Exercise frequency:  ☐ None  ☐ 1-2x/week  ☐ 3-4x/week  ☐ 5+/week",
        "Average hours of sleep per night: ________",
        "Stress level (1-10): ________",
        "Current diet:  ☐ Standard  ☐ Vegetarian  ☐ Vegan  ☐ Keto  ☐ Paleo  ☐ Other: _______",
        "Water intake (glasses/day): ________",
        "Occupation: ________________________________",
      ];
      lifestyle.forEach(l => { doc.fontSize(9).text(l); doc.moveDown(0.2); });
      doc.moveDown(0.3);

      // ─── SECTION 8: SPECIFIC PEPTIDE ASSESSMENT ───
      doc.addPage();
      sectionHeader(doc, "SECTION 8: PEPTIDE-SPECIFIC CLINICAL ASSESSMENT");
      doc.fontSize(9).font("Helvetica")
        .text("The following questions help determine which peptide therapy is most appropriate for you.");
      doc.moveDown(0.3);

      doc.font("Helvetica-Bold").text("A. For BPC-157 (Body Protection Compound) Candidates:");
      doc.font("Helvetica").moveDown(0.15);
      const bpc157 = [
        "Do you have any current injuries (tendon, ligament, muscle)?  ☐ Yes  ☐ No",
        "Do you experience chronic joint or muscle pain?  ☐ Yes  ☐ No — Location: ___________",
        "Do you have gastrointestinal issues (leaky gut, IBS, ulcers)?  ☐ Yes  ☐ No",
        "Have you had recent surgery requiring tissue healing?  ☐ Yes  ☐ No — Date: _______",
        "Do you have inflammatory bowel disease?  ☐ Yes  ☐ No",
      ];
      bpc157.forEach(q => { doc.text(q, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("B. For GHK-Cu (Copper Peptide) Candidates:");
      doc.font("Helvetica").moveDown(0.15);
      const ghkcu = [
        "Are you seeking skin rejuvenation or anti-aging benefits?  ☐ Yes  ☐ No",
        "Do you have visible signs of skin aging (wrinkles, laxity, dullness)?  ☐ Yes  ☐ No",
        "Are you experiencing hair thinning or hair loss?  ☐ Yes  ☐ No",
        "Do you have scars or wounds that are slow to heal?  ☐ Yes  ☐ No",
        "Are you interested in collagen stimulation?  ☐ Yes  ☐ No",
      ];
      ghkcu.forEach(q => { doc.text(q, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("C. For Thymosin Alpha-1 Candidates:");
      doc.font("Helvetica").moveDown(0.15);
      const thymosin = [
        "Do you get sick frequently (>3 colds/infections per year)?  ☐ Yes  ☐ No",
        "Do you have a chronic viral infection (hepatitis, EBV, CMV)?  ☐ Yes  ☐ No",
        "Have you been diagnosed with an autoimmune condition?  ☐ Yes  ☐ No",
        "Are you undergoing or have you completed cancer treatment?  ☐ Yes  ☐ No",
        "Do you have chronic fatigue or immune dysfunction?  ☐ Yes  ☐ No",
      ];
      thymosin.forEach(q => { doc.text(q, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("D. For CJC-1295/Ipamorelin Candidates:");
      doc.font("Helvetica").moveDown(0.15);
      const cjc = [
        "Are you experiencing age-related decline in energy or vitality?  ☐ Yes  ☐ No",
        "Do you have difficulty losing body fat despite diet and exercise?  ☐ Yes  ☐ No",
        "Are you experiencing decreased muscle mass or strength?  ☐ Yes  ☐ No",
        "Do you have poor sleep quality or insomnia?  ☐ Yes  ☐ No",
        "Have you had your IGF-1 or growth hormone levels tested?  ☐ Yes  ☐ No — Results: ______",
        "Are you interested in anti-aging and longevity optimization?  ☐ Yes  ☐ No",
      ];
      cjc.forEach(q => { doc.text(q, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.3);

      // ─── SECTION 9: LAB WORK ───
      sectionHeader(doc, "SECTION 9: RECENT LAB WORK");
      doc.fontSize(9).font("Helvetica")
        .text("Please provide dates and results of any recent lab work (within the last 6 months):");
      doc.moveDown(0.2);
      const labs = [
        "Complete Blood Count (CBC): Date: ________ Results: ☐ Normal  ☐ Abnormal — Details: ___________",
        "Comprehensive Metabolic Panel (CMP): Date: ________ Results: ☐ Normal  ☐ Abnormal",
        "Liver Function Tests (AST/ALT): Date: ________ Results: ☐ Normal  ☐ Abnormal",
        "Kidney Function (BUN/Creatinine): Date: ________ Results: ☐ Normal  ☐ Abnormal",
        "Thyroid Panel (TSH, T3, T4): Date: ________ Results: ☐ Normal  ☐ Abnormal",
        "Hormone Panel: Date: ________ Results: ☐ Normal  ☐ Abnormal",
        "IGF-1 Level: Date: ________ Result: ________",
        "Hemoglobin A1c: Date: ________ Result: ________",
        "Inflammatory Markers (CRP, ESR): Date: ________ Results: ☐ Normal  ☐ Abnormal",
      ];
      labs.forEach(l => { doc.text(l, { indent: 10 }); doc.moveDown(0.15); });
      doc.moveDown(0.3);

      // ─── SECTION 10: INFORMED CONSENT ───
      doc.addPage();
      sectionHeader(doc, "SECTION 10: INFORMED CONSENT FOR PEPTIDE THERAPY");
      doc.fontSize(9).font("Helvetica");

      const consentParagraphs = [
        `I, the undersigned patient, hereby request and consent to peptide therapy treatment(s) to be administered by ${PROVIDER} at ${CLINIC_NAME}. I understand the following:`,
        "",
        "NATURE OF TREATMENT:",
        "Peptide therapy involves the administration of bioactive peptides — short chains of amino acids — that may be delivered via subcutaneous injection, intramuscular injection, topical application, or oral administration. The specific peptide(s), dosage, frequency, and route of administration will be determined by the treating provider based on my individual clinical assessment.",
        "",
        "POTENTIAL BENEFITS:",
        "Benefits may include but are not limited to: tissue repair and healing, anti-aging effects, improved immune function, enhanced sleep quality, increased energy, improved body composition, hair growth stimulation, cognitive enhancement, and overall wellness optimization. Results vary by individual and are not guaranteed.",
        "",
        "RISKS AND POTENTIAL SIDE EFFECTS:",
        "I understand that peptide therapy, like all medical treatments, carries potential risks and side effects including but not limited to:",
        "• Injection site reactions: pain, redness, swelling, bruising, itching, or infection",
        "• Systemic reactions: headache, dizziness, nausea, fatigue, flushing, or water retention",
        "• Allergic reactions: ranging from mild skin reactions to severe anaphylaxis (rare)",
        "• Hormonal effects: changes in hormone levels, potential impact on fertility",
        "• Gastrointestinal effects: nausea, diarrhea, abdominal discomfort",
        "• Cardiovascular effects: changes in blood pressure or heart rate",
        "• Metabolic effects: changes in blood sugar levels, insulin sensitivity",
        "• Neurological effects: tingling, numbness, or changes in sensation",
        "• Unknown long-term effects: some peptides have limited long-term safety data",
        "• Interaction with other medications or supplements",
        "• Rare but serious: blood clots, organ damage, or other unforeseen complications",
        "",
        "ALTERNATIVES:",
        "I understand that alternatives to peptide therapy exist and may include: lifestyle modifications (diet, exercise, sleep optimization), conventional pharmaceutical treatments, hormone replacement therapy, nutritional supplementation, or no treatment at all. These alternatives have been discussed with me.",
        "",
        "CONTRAINDICATIONS:",
        "I understand that peptide therapy may be contraindicated in certain conditions including but not limited to: active cancer, pregnancy or breastfeeding, severe organ dysfunction, certain autoimmune conditions, and known hypersensitivity to peptide components. I have disclosed all relevant medical history to my provider.",
        "",
        "PATIENT RESPONSIBILITIES:",
        "I agree to:",
        "• Follow all dosing instructions exactly as prescribed",
        "• Report any adverse reactions immediately to the clinic",
        "• Attend all scheduled follow-up appointments",
        "• Complete recommended lab work as requested",
        "• Inform the provider of any changes in my health status or medications",
        "• Properly store and handle all peptide medications as instructed",
        "• Not share my prescribed peptides with any other person",
        "• Notify the provider if I become pregnant or plan to become pregnant",
        "",
        "FINANCIAL RESPONSIBILITY:",
        "I understand that peptide therapy is an elective treatment and may not be covered by insurance. I accept financial responsibility for all costs associated with my treatment, including consultations, lab work, medications, and follow-up visits. Pricing has been discussed with me prior to treatment.",
        "",
        "PHOTOGRAPHY & DOCUMENTATION:",
        "I consent to clinical photographs being taken for my medical record. These images will be used solely for treatment documentation and progress tracking unless I provide separate written consent for any other use.",
        "",
        "CALIFORNIA-SPECIFIC DISCLOSURES:",
        "Pursuant to California Business and Professions Code and California Health and Safety Code, I acknowledge that:",
        "• I have the right to be informed about my treatment options",
        "• I have the right to refuse treatment at any time",
        "• I have the right to a second opinion",
        "• I have the right to access my medical records",
        "• I have the right to file a complaint with the Medical Board of California",
        "• This consent does not waive any of my legal rights",
      ];

      consentParagraphs.forEach(p => {
        if (p === "") {
          doc.moveDown(0.3);
        } else if (p.endsWith(":") && !p.startsWith("•") && !p.startsWith("I,")) {
          doc.font("Helvetica-Bold").text(p);
          doc.font("Helvetica");
          doc.moveDown(0.1);
        } else {
          doc.text(p, { indent: p.startsWith("•") ? 15 : 0 });
          doc.moveDown(0.1);
        }
      });

      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("ACKNOWLEDGMENT AND SIGNATURES:");
      doc.font("Helvetica").moveDown(0.3);
      doc.text("I have read and understand this entire document. I have had the opportunity to ask questions, and all my questions have been answered to my satisfaction. I voluntarily consent to peptide therapy as described above.");
      doc.moveDown(0.5);

      doc.text("Patient Signature: _________________________________ Date: ________________");
      doc.moveDown(0.3);
      doc.text("Patient Printed Name: _____________________________");
      doc.moveDown(0.5);
      doc.text("Provider Signature: _________________________________ Date: ________________");
      doc.moveDown(0.3);
      doc.text(`Provider Printed Name: ${PROVIDER}`);
      doc.moveDown(0.5);
      doc.text("Witness Signature: _________________________________ Date: ________________");
      doc.moveDown(0.3);
      doc.text("Witness Printed Name: _____________________________");

      // Footer on each page
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(7).font("Helvetica").fillColor("#999");
        doc.text(
          `${CLINIC_NAME} | ${PROVIDER} | Peptide Therapy Intake & Consent | Page ${i + 1} of ${pageCount}`,
          50, doc.page.height - 40,
          { align: "center", width: pageWidth }
        );
        doc.fillColor("black");
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

function sectionHeader(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(0.3);
  doc.fontSize(11).font("Helvetica-Bold").fillColor("#4B0082").text(title);
  doc.fillColor("black");
  doc.moveDown(0.3);
  const y = doc.y;
  doc.moveTo(50, y).lineTo(doc.page.width - 50, y).lineWidth(0.5).stroke();
  doc.moveDown(0.3);
}
