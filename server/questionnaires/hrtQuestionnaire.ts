import PDFDocument from "pdfkit";

const CLINIC_NAME = "RADIANTILYK AESTHETIC";
const PROVIDER = "Kiem Vukadinovic, NP";
const LOCATIONS = [
  "San Mateo: 1528 S El Camino Real, San Mateo, Unit 200",
  "San Jose: 2100 Curtner Ave, Unit 1B, San Jose, CA 95124",
];

/**
 * Generate a litigation-tight Hormone Replacement Therapy Intake Questionnaire & Consent Form.
 * California-compliant, extremely detailed, legally defensible.
 */
export async function generateHRTQuestionnaire(
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
          Title: "Hormone Replacement Therapy Intake Questionnaire & Informed Consent",
          Author: CLINIC_NAME,
          Subject: "Hormone Replacement Therapy Medical Intake",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - 100;
      const checkBox = "☐ ";

      // ─── HEADER ───
      doc.fontSize(18).font("Helvetica-Bold").text(CLINIC_NAME, { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(9).font("Helvetica").text(LOCATIONS[0], { align: "center" });
      doc.text(LOCATIONS[1], { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(14).font("Helvetica-Bold").fillColor("#4B0082")
        .text("HORMONE REPLACEMENT THERAPY", { align: "center" });
      doc.fontSize(11).fillColor("#4B0082")
        .text("INTAKE QUESTIONNAIRE & INFORMED CONSENT", { align: "center" });
      doc.fillColor("black");
      doc.moveDown(0.3);
      doc.fontSize(8).font("Helvetica-Oblique").fillColor("#666")
        .text("This document is confidential and protected under HIPAA. All information is used solely for medical treatment purposes.", { align: "center" });
      doc.fillColor("black");
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(pageWidth + 50, doc.y).stroke();
      doc.moveDown(0.5);

      // ─── SECTION 1: PATIENT INFORMATION ───
      sectionHeader(doc, "SECTION 1: PATIENT INFORMATION");
      const fields1 = [
        "Full Legal Name: " + (patientName || "___________________________________"),
        "Date of Birth: " + (patientDob || "____/____/________") + "     Age: ________",
        "Biological Sex:  ☐ Male  ☐ Female       Gender Identity:  ☐ Male  ☐ Female  ☐ Non-binary  ☐ Other: ______",
        "Address: _______________________________________________________________",
        "City: _________________________ State: _______ ZIP: ___________",
        "Phone: _________________________ Email: ________________________________",
        "Emergency Contact: _________________________ Phone: ____________________",
        "Relationship: ________________________",
        "Primary Care Physician: _________________________ Phone: ________________",
        "Endocrinologist (if any): _________________________ Phone: ________________",
        "OB/GYN (if applicable): _________________________ Phone: ________________",
        "Preferred Pharmacy: ____________________________________________________",
      ];
      fields1.forEach(f => { doc.fontSize(9).font("Helvetica").text(f); doc.moveDown(0.3); });
      doc.moveDown(0.3);

      // ─── SECTION 2: REASON FOR VISIT ───
      sectionHeader(doc, "SECTION 2: REASON FOR SEEKING HORMONE REPLACEMENT THERAPY");
      doc.fontSize(9).font("Helvetica").text("Please check ALL symptoms you are currently experiencing:");
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("General Symptoms:");
      doc.font("Helvetica");
      const generalSymptoms = [
        "Fatigue / low energy", "Weight gain (unexplained)", "Difficulty losing weight",
        "Brain fog / poor concentration", "Memory problems", "Mood swings / irritability",
        "Depression or anxiety", "Insomnia / poor sleep quality", "Night sweats",
        "Decreased motivation", "Decreased libido / sex drive", "Joint pain or stiffness",
        "Muscle weakness or loss", "Hair thinning or hair loss", "Dry skin or skin changes",
        "Brittle nails", "Headaches / migraines",
      ];
      generalSymptoms.forEach(s => { doc.text(checkBox + s, { indent: 10 }); doc.moveDown(0.1); });
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("Female-Specific Symptoms:");
      doc.font("Helvetica");
      const femaleSymptoms = [
        "Hot flashes", "Vaginal dryness", "Painful intercourse",
        "Irregular periods", "Heavy periods", "Absent periods (amenorrhea)",
        "Breast tenderness", "Bloating / water retention", "PMS symptoms worsening",
        "Perimenopause symptoms", "Menopause symptoms", "Post-menopausal symptoms",
        "Urinary incontinence or urgency", "Recurrent UTIs", "Bone density concerns / osteoporosis",
      ];
      femaleSymptoms.forEach(s => { doc.text(checkBox + s, { indent: 10 }); doc.moveDown(0.1); });
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("Male-Specific Symptoms:");
      doc.font("Helvetica");
      const maleSymptoms = [
        "Erectile dysfunction", "Decreased morning erections",
        "Decreased muscle mass", "Increased body fat (especially abdominal)",
        "Gynecomastia (breast tissue development)", "Decreased beard growth",
        "Testicular atrophy", "Decreased bone density",
        "Decreased stamina / endurance", "Recovery takes longer after exercise",
      ];
      maleSymptoms.forEach(s => { doc.text(checkBox + s, { indent: 10 }); doc.moveDown(0.1); });
      doc.moveDown(0.3);

      // ─── SECTION 3: REPRODUCTIVE HISTORY ───
      doc.addPage();
      sectionHeader(doc, "SECTION 3: REPRODUCTIVE & HORMONAL HISTORY");

      doc.font("Helvetica-Bold").fontSize(9).text("For Female Patients:");
      doc.font("Helvetica").moveDown(0.15);
      const femaleRepro = [
        "Age at first menstrual period: ________",
        "Date of last menstrual period: ________",
        "Are your periods regular?  ☐ Yes  ☐ No  ☐ N/A (post-menopausal)",
        "Number of pregnancies: ______  Live births: ______  Miscarriages: ______",
        "Have you had a hysterectomy?  ☐ Yes  ☐ No — If yes, date: ________ Partial or Total: ________",
        "Have you had an oophorectomy (ovary removal)?  ☐ Yes  ☐ No — ☐ One  ☐ Both",
        "Are you currently using birth control?  ☐ Yes  ☐ No — Type: ________________",
        "Are you pregnant or planning to become pregnant?  ☐ Yes  ☐ No",
        "Are you currently breastfeeding?  ☐ Yes  ☐ No",
        "History of endometriosis?  ☐ Yes  ☐ No",
        "History of PCOS (polycystic ovarian syndrome)?  ☐ Yes  ☐ No",
        "History of uterine fibroids?  ☐ Yes  ☐ No",
        "History of abnormal Pap smear?  ☐ Yes  ☐ No — Date of last Pap: ________",
        "Date of last mammogram: ________ Results: ☐ Normal  ☐ Abnormal",
        "History of breast cancer in self or family?  ☐ Yes  ☐ No — Relationship: ________",
      ];
      femaleRepro.forEach(q => { doc.text(q, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.3);

      doc.font("Helvetica-Bold").text("For Male Patients:");
      doc.font("Helvetica").moveDown(0.15);
      const maleRepro = [
        "Have you had a vasectomy?  ☐ Yes  ☐ No",
        "Do you plan to father children in the future?  ☐ Yes  ☐ No  ☐ Unsure",
        "History of prostate issues?  ☐ Yes  ☐ No — Specify: ________________",
        "Date of last PSA test: ________ Result: ________",
        "History of testicular issues?  ☐ Yes  ☐ No — Specify: ________________",
        "Have you used anabolic steroids?  ☐ Yes  ☐ No — Duration: ________",
        "History of prostate cancer in self or family?  ☐ Yes  ☐ No",
        "Current sperm count or fertility testing?  ☐ Yes  ☐ No — Results: ________",
      ];
      maleRepro.forEach(q => { doc.text(q, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.3);

      // ─── SECTION 4: PREVIOUS HRT ───
      sectionHeader(doc, "SECTION 4: PREVIOUS HORMONE THERAPY HISTORY");
      doc.fontSize(9).font("Helvetica")
        .text("Have you previously used any form of hormone therapy?  ☐ Yes  ☐ No");
      doc.moveDown(0.2);
      doc.text("If yes, please provide details for each:");
      doc.moveDown(0.2);
      for (let i = 0; i < 3; i++) {
        doc.text(`Therapy ${i + 1}: Type: ________________ Dose: ________ Duration: ________`);
        doc.text(`   Provider: ________________ Reason stopped: ________________________________`);
        doc.text(`   Side effects experienced: ________________________________________________`);
        doc.moveDown(0.2);
      }
      doc.moveDown(0.2);

      // ─── SECTION 5: MEDICAL HISTORY ───
      doc.addPage();
      sectionHeader(doc, "SECTION 5: COMPREHENSIVE MEDICAL HISTORY");
      doc.fontSize(9).font("Helvetica")
        .text("Do you currently have or have you ever been diagnosed with any of the following?");
      doc.moveDown(0.2);
      const conditions = [
        "Diabetes (Type 1 or Type 2)", "Hypertension", "Heart disease / heart attack / angina",
        "Stroke or TIA", "Blood clots (DVT, PE, or clotting disorders)",
        "Cancer — Type: _____________________ Year: _______",
        "Breast cancer (personal or family history)", "Uterine/endometrial cancer",
        "Prostate cancer (personal or family history)", "Ovarian cancer",
        "Liver disease (hepatitis, cirrhosis)", "Kidney disease",
        "Thyroid disorder — Type: ___________________",
        "Adrenal insufficiency or Addison's disease", "Pituitary disorder",
        "PCOS (Polycystic Ovarian Syndrome)", "Endometriosis",
        "Osteoporosis or osteopenia", "Autoimmune disease — Type: _______________",
        "Seizure disorder", "Migraines with aura",
        "Gallbladder disease", "Sleep apnea",
        "Depression / anxiety / bipolar disorder", "Eating disorder",
      ];
      conditions.forEach(c => { doc.text(checkBox + c, { indent: 10 }); doc.moveDown(0.1); });
      doc.moveDown(0.3);

      // ─── SECTION 6: MEDICATIONS ───
      sectionHeader(doc, "SECTION 6: CURRENT MEDICATIONS & SUPPLEMENTS");
      doc.fontSize(9).font("Helvetica")
        .text("List ALL current medications, supplements, and vitamins:");
      doc.moveDown(0.2);
      doc.fontSize(8).font("Helvetica-Bold")
        .text("Medication Name          Dose          Frequency          Reason");
      doc.font("Helvetica");
      for (let i = 0; i < 6; i++) {
        doc.text("_____________________________________________________________________________");
        doc.moveDown(0.15);
      }
      doc.moveDown(0.2);
      doc.fontSize(9).text("Are you currently taking any of the following?");
      const meds = [
        "Blood thinners (Warfarin, Eliquis, Xarelto, aspirin)",
        "Thyroid medication (Synthroid, Armour Thyroid, levothyroxine)",
        "Insulin or diabetes medications",
        "Antidepressants or anti-anxiety medications",
        "Birth control pills, patches, or IUD",
        "Bioidentical hormones from another provider",
        "Compounded hormones",
        "Over-the-counter hormone supplements (DHEA, pregnenolone, melatonin)",
        "Herbal supplements affecting hormones (black cohosh, maca, vitex, DIM)",
        "Corticosteroids (prednisone, hydrocortisone)",
      ];
      meds.forEach(m => { doc.text(checkBox + m, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.3);

      // ─── SECTION 7: REQUIRED LAB WORK ───
      doc.addPage();
      sectionHeader(doc, "SECTION 7: REQUIRED BASELINE LAB WORK");
      doc.fontSize(9).font("Helvetica")
        .text("The following lab tests are required before initiating hormone replacement therapy. Please provide recent results (within 3 months) or we will order them for you:");
      doc.moveDown(0.3);

      doc.font("Helvetica-Bold").text("Required for ALL Patients:");
      doc.font("Helvetica").moveDown(0.15);
      const allLabs = [
        "Complete Blood Count (CBC): Date: ________ Results attached: ☐ Yes  ☐ No  ☐ Need to order",
        "Comprehensive Metabolic Panel (CMP): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Lipid Panel (cholesterol, LDL, HDL, triglycerides): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Thyroid Panel (TSH, Free T3, Free T4): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Hemoglobin A1c: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Vitamin D (25-OH): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "DHEA-S: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Cortisol (AM): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
      ];
      allLabs.forEach(l => { doc.text(l, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("Additional for Female Patients:");
      doc.font("Helvetica").moveDown(0.15);
      const femaleLabs = [
        "Estradiol (E2): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Progesterone: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Total & Free Testosterone: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "FSH & LH: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Sex Hormone Binding Globulin (SHBG): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
      ];
      femaleLabs.forEach(l => { doc.text(l, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.2);

      doc.font("Helvetica-Bold").text("Additional for Male Patients:");
      doc.font("Helvetica").moveDown(0.15);
      const maleLabs = [
        "Total Testosterone: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Free Testosterone: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Estradiol (E2): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "PSA (Prostate-Specific Antigen): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Sex Hormone Binding Globulin (SHBG): Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "LH & FSH: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
        "Hematocrit: Date: ________ ☐ Yes  ☐ No  ☐ Need to order",
      ];
      maleLabs.forEach(l => { doc.text(l, { indent: 10 }); doc.moveDown(0.12); });
      doc.moveDown(0.3);

      // ─── SECTION 8: LIFESTYLE ───
      sectionHeader(doc, "SECTION 8: LIFESTYLE & SOCIAL HISTORY");
      const lifestyle = [
        "Do you smoke or use tobacco?  ☐ Yes  ☐ No  ☐ Former — Quit date: _______",
        "Do you consume alcohol?  ☐ No  ☐ Occasionally  ☐ Moderately  ☐ Heavily — Drinks/week: ____",
        "Do you use recreational drugs?  ☐ Yes  ☐ No — If yes, specify: _______________",
        "Exercise frequency:  ☐ None  ☐ 1-2x/week  ☐ 3-4x/week  ☐ 5+/week",
        "Type of exercise: ________________________________",
        "Average hours of sleep per night: ________",
        "Sleep quality:  ☐ Excellent  ☐ Good  ☐ Fair  ☐ Poor",
        "Stress level (1-10): ________",
        "Current diet:  ☐ Standard  ☐ Vegetarian  ☐ Vegan  ☐ Keto  ☐ Paleo  ☐ Mediterranean  ☐ Other: _______",
        "Daily water intake (oz): ________",
        "Caffeine intake (cups/day): ________",
        "Occupation: ________________________________",
        "Do you work night shifts?  ☐ Yes  ☐ No",
      ];
      lifestyle.forEach(l => { doc.fontSize(9).text(l); doc.moveDown(0.2); });
      doc.moveDown(0.3);

      // ─── SECTION 9: INFORMED CONSENT ───
      doc.addPage();
      sectionHeader(doc, "SECTION 9: INFORMED CONSENT FOR HORMONE REPLACEMENT THERAPY");
      doc.fontSize(9).font("Helvetica");

      const consentParagraphs = [
        `I, the undersigned patient, hereby request and consent to hormone replacement therapy (HRT) to be administered by ${PROVIDER} at ${CLINIC_NAME}. I understand the following:`,
        "",
        "NATURE OF TREATMENT:",
        "Hormone replacement therapy involves the administration of bioidentical or synthetic hormones to address hormonal deficiencies or imbalances. Treatment may include estrogen, progesterone, testosterone, DHEA, thyroid hormones, or other hormones as clinically indicated. Hormones may be delivered via topical creams, patches, pellets, injections, sublingual tablets, or oral capsules.",
        "",
        "POTENTIAL BENEFITS:",
        "Benefits may include but are not limited to: relief of menopausal/andropausal symptoms, improved energy and mood, better sleep quality, enhanced libido, improved bone density, better cognitive function, improved body composition, healthier skin and hair, and overall improved quality of life. Individual results vary and are not guaranteed.",
        "",
        "RISKS AND POTENTIAL SIDE EFFECTS:",
        "I understand that HRT carries potential risks including but not limited to:",
        "",
        "General Risks:",
        "• Headaches, bloating, breast tenderness, mood changes",
        "• Acne, oily skin, or skin reactions at application site",
        "• Weight changes, fluid retention",
        "• Nausea, digestive changes",
        "• Changes in blood pressure",
        "• Blood clots (deep vein thrombosis, pulmonary embolism) — risk varies by route of administration",
        "• Liver function changes",
        "• Allergic reactions",
        "",
        "Estrogen-Specific Risks (Female Patients):",
        "• Increased risk of endometrial hyperplasia or cancer (if used without progesterone in women with a uterus)",
        "• Potential increased risk of breast cancer with long-term use",
        "• Gallbladder disease",
        "• Uterine bleeding or spotting",
        "",
        "Testosterone-Specific Risks:",
        "• Polycythemia (elevated red blood cell count) — requires monitoring",
        "• Acne, hair loss (androgenic alopecia), or increased body hair",
        "• Mood changes, irritability, or aggression",
        "• Potential negative impact on fertility and sperm production in males",
        "• Liver function changes",
        "• Cardiovascular risks (under ongoing research)",
        "• Testicular atrophy with exogenous testosterone use in males",
        "• Virilization symptoms in females (deepening voice, facial hair) — dose-dependent",
        "",
        "Progesterone-Specific Risks:",
        "• Drowsiness, dizziness",
        "• Breast tenderness",
        "• Mood changes",
        "• Bloating",
        "",
        "CONTRAINDICATIONS:",
        "HRT may be contraindicated in patients with: active or history of hormone-sensitive cancers, undiagnosed vaginal bleeding, active blood clots or clotting disorders, active liver disease, pregnancy or breastfeeding, uncontrolled hypertension, or known hypersensitivity to hormone preparations. I have disclosed all relevant medical history.",
        "",
        "MONITORING REQUIREMENTS:",
        "I understand and agree to the following monitoring schedule:",
        "• Baseline lab work before initiating therapy (as outlined in Section 7)",
        "• Follow-up labs at 6-8 weeks after starting or adjusting therapy",
        "• Ongoing lab monitoring every 3-6 months as directed",
        "• Annual comprehensive lab panel and clinical assessment",
        "• Mammogram and/or PSA testing as age and risk-appropriate",
        "• Bone density testing as clinically indicated",
        "• Immediate reporting of any adverse symptoms",
        "",
        "PATIENT RESPONSIBILITIES:",
        "I agree to:",
        "• Use hormones exactly as prescribed — do not adjust doses without provider approval",
        "• Attend all scheduled follow-up appointments and complete required lab work",
        "• Report any adverse reactions, new symptoms, or medication changes immediately",
        "• Inform all other healthcare providers that I am on HRT",
        "• Notify the provider immediately if I become pregnant or plan to become pregnant",
        "• Not share my prescribed hormones with any other person",
        "• Store all medications properly as instructed",
        "• Maintain recommended lifestyle modifications (diet, exercise, sleep)",
        "",
        "FINANCIAL RESPONSIBILITY:",
        "I understand that hormone replacement therapy is an elective treatment and may not be fully covered by insurance. I accept financial responsibility for all costs including consultations, lab work, medications, pellet insertion procedures, and follow-up visits.",
        "",
        "CALIFORNIA-SPECIFIC DISCLOSURES:",
        "Pursuant to California law, I acknowledge that:",
        "• I have the right to be fully informed about my treatment options and alternatives",
        "• I have the right to refuse or discontinue treatment at any time without penalty",
        "• I have the right to a second opinion from another qualified provider",
        "• I have the right to access and obtain copies of my medical records",
        "• I have the right to file a complaint with the appropriate licensing board",
        "• This consent does not waive any of my legal rights under California or federal law",
        "• I have been informed of the Patients' Bill of Rights as required by California Health & Safety Code",
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
      doc.text("I have read and understand this entire document. I have had the opportunity to ask questions, and all my questions have been answered to my satisfaction. I voluntarily consent to hormone replacement therapy as described above. I understand that I may withdraw my consent and discontinue treatment at any time.");
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
          `${CLINIC_NAME} | ${PROVIDER} | HRT Intake & Consent | Page ${i + 1} of ${pageCount}`,
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
