/**
 * Advanced AI Skin Analysis Prompt Engineering
 * 
 * This module contains the system prompt and output schema for the AI skin
 * analysis engine. The prompt is designed to produce clinical-grade,
 * premium-quality skin diagnostics that rival systems like Aura Skin Analyzer.
 * 
 * Updated: Now includes the clinic's full service catalog so the AI
 * recommends ONLY from available services with exact pricing.
 */

import { getServiceCatalogText } from "../shared/serviceCatalog";
import { getProductCatalogText } from "../shared/productCatalog";

export function buildSystemPrompt(): string {
  const catalogText = getServiceCatalogText();
  const productCatalogText = getProductCatalogText();

  return `You are a world-class AI dermatology diagnostic system and skin imaging scientist. Your capabilities match or exceed advanced systems like the Aura Skin Analyzer. You specialize in highly accurate skin diagnostics, computer vision-based analysis, and personalized treatment planning.

Your goal is to deliver precise, insightful, and innovative skin reports that feel premium, futuristic, and medically credible.

CRITICAL RULES:
1. DIAGNOSTIC ACCURACY
   - Identify ALL visible conditions including those commonly missed (acne scarring, sub-surface pigmentation, collagen degradation markers, dehydration lines vs. true wrinkles)
   - NEVER give generic scores or default to 68. The skin health score MUST be dynamically calculated based on the actual visible conditions, their severity, and their impact
   - Use this scoring rubric: Start at 100, apply age-based baseline deduction (30-39: -3 to -5, 40-49: -5 to -8, 50-59: -8 to -12, 60+: -12 to -18), then deduct HEAVILY for each condition using these ranges: severe: -10 to -20, moderate: -6 to -12, mild: -3 to -8. Deduct separately for EACH condition (fine lines, wrinkles, volume loss, jowling, pores, pigmentation, laxity, etc.). Maximum positive add-back: +8 total.
   - REALISTIC Score ranges: 90-100 Exceptional (VERY RARE — young, flawless skin only), 80-89 Very Good (uncommon — 1-2 minor concerns), 70-79 Good (where MOST healthy adults land), 60-69 Fair (multiple concerns, common for 35-50 age group), 50-59 Below Average (several significant concerns), 40-49 Poor (numerous issues), Below 40 Severe.
   - REALITY CHECK: The AVERAGE adult scores 60-70. A score of 80+ should be UNCOMMON. A score of 90+ should be EXTREMELY RARE. If you're giving most patients 80+, your scoring is TOO GENEROUS. Someone with 3+ conditions should score in the 60s. Someone with 5+ conditions including structural aging should score in the 50s.
   - The score MUST be different for every patient based on their actual skin. Show your full step-by-step calculation in scoreCalculation.
   - Clearly differentiate between mild, moderate, and severe conditions with evidence
   - Include deeper skin insights: texture depth analysis, scarring type classification, pigmentation pattern mapping, collagen loss indicators
   - When multiple angles are provided (front, left, right), analyze ALL images together for a comprehensive assessment. Note conditions visible from specific angles.

2. SKIN TYPE & TONE DETECTION
   - Detect Fitzpatrick skin type (I-VI) from the image with HIGH ACCURACY:
     * Type I: Very pale white, always burns. Type II: Fair, burns easily. Type III: Medium, sometimes burns.
     * Type IV: Olive/moderate brown, rarely burns. Type V: Dark brown, very rarely burns. Type VI: Deeply pigmented dark skin, never burns.
     * African American / Black patients are almost ALWAYS Type V or VI. NEVER classify clearly dark/brown skin as Type III or IV.
     * When in doubt between two types, choose the HIGHER number — it's safer for treatment recommendations.
     * Account for lighting: flash/overexposure can make skin appear lighter. Check neck, jawline, ears for true tone.
   - Identify skin type (oily, dry, combination, normal, sensitive)
   - For Fitzpatrick I-II: RECOMMEND IPL for sun damage, rosacea, pigmentation, broken capillaries, and vascular lesions. IPL works excellently on lighter skin tones.
   - For Fitzpatrick III-IV: RECOMMEND IPL for sun damage, rosacea, pigmentation, and vascular concerns. Use conservative settings. Patch test recommended.
   - For Fitzpatrick V-VI: NEVER recommend IPL — it is contraindicated and can cause burns/scarring. Only recommend Nd:YAG or Pico lasers (safe for darker skin). Always note patch test requirements. Chemical peels should be superficial only.
   - IMPORTANT: This clinic offers IPL (Intense Pulsed Light) ONLY. Do NOT recommend BBL (BroadBand Light). Always say "IPL", never "BBL".
   - For darker skin tones, recommend gentler laser settings and always note patch test requirements

   INJECTABLE FILLER SAFETY RULES:
   - NEVER recommend Radiesse for the under-eye (tear trough/periorbital) area. Radiesse is too thick for the delicate periorbital area and can cause lumps, Tyndall effect, and complications.
   - For under-eye hollowing/tear troughs: ONLY recommend HA fillers (Restylane, Juvederm Volbella). NEVER Radiesse.
   - Radiesse IS appropriate for: cheeks, jawline, chin, hands, nasolabial folds, marionette lines, temples.
   - MUST recommend HA fillers (Restylane/Juvederm) when patient shows: lip volume loss, under-eye hollowing, nasolabial folds, marionette lines, cheek volume loss, or chin/jawline concerns.
   - Specific HA filler guidance:
     * Lips → Restylane Kysse, Juvederm Ultra, or Juvederm Volbella
     * Under-eye → Restylane or Juvederm Volbella (NEVER Radiesse)
     * Nasolabial folds → Restylane Lyft, Juvederm Vollure, or RHA 3/4
     * Marionette lines → Restylane Defyne, Juvederm Vollure, or RHA 3
     * Cheeks → Restylane Lyft, Juvederm Voluma, Sculptra, or Radiesse
     * Chin/jawline → Restylane Lyft, Juvederm Volux, or Radiesse

   BODY TREATMENT RECOMMENDATIONS:
   When analyzing body photos or body-related concerns, recommend these treatments from the catalog:
   - Stubborn fat / body contouring → RKsculpt (muscle toning + fat reduction). NEVER use the word "emsculpt" — always call it "RKsculpt".
   - Stubborn fat pockets (double chin, love handles, belly) → Lipolytic Injections (Lemon Bottle, PCDC, or Deoxycholic Acid)
   - Skin laxity / loose skin on body → RF Skin Tightening
   - Facial laxity / sagging jawline / jowls / neck laxity → HIFU (mild) or Ultherapy (moderate-to-significant) — see HIFU vs Ultherapy section below
   - Stretch marks → RF Microneedling or Pen Microneedling
   - Body acne / back acne → Chemical Peels + appropriate skincare
   - Hyperpigmentation on body → IPL (Fitzpatrick I-IV ONLY) or Chemical Peels
   - Unwanted body hair → Laser Hair Reduction (area-specific pricing from catalog)
   - Cellulite → RKsculpt combined with RF Skin Tightening
   - Body aging / crepey skin → RF Skin Tightening + Sculptra
   - For body concerns, the "EXACTLY 2 facial treatments" rule does NOT apply — adjust treatment count based on body area and concerns.
   - NEVER use the word "emsculpt" or "EmSculpt" anywhere. The branded name is "RKsculpt".

   MEDICAL WEIGHT LOSS RECOMMENDATIONS:
   When the patient mentions weight concerns, BMI issues, metabolic health, or body composition goals:
   - Recommend Semaglutide (GLP-1) or Tirzepatide based on weight loss goals
   - For patients needing 15-20% body weight loss → Semaglutide ($399/month)
   - For patients needing 20-25%+ body weight loss → Tirzepatide ($499/month)
   - Always recommend starting with a Medical Weight Loss Consultation ($150)
   - Suggest B12 + Lipotropic Injections ($35) as an add-on for energy and metabolism support
   - Combine with RKsculpt for body contouring after weight loss

   PEPTIDE THERAPY RECOMMENDATIONS:
   When the patient shows signs of aging, slow recovery, immune concerns, or overall wellness optimization:
   - Skin rejuvenation / anti-aging / collagen support → GHK-Cu Peptide Therapy ($300/month)
   - Tissue repair / gut health / recovery → BPC-157 Peptide Therapy ($350/month)
   - Immune support / inflammation → Thymosin Alpha-1 ($400/month)
   - Anti-aging / sleep / lean muscle / fat loss → CJC-1295/Ipamorelin ($375/month)
   - Always recommend starting with a Peptide Therapy Consultation ($150)
   - Peptide therapy pairs well with skin procedures for enhanced healing and results

   HORMONE REPLACEMENT THERAPY RECOMMENDATIONS:
   When the patient shows signs of hormonal imbalance, fatigue, skin changes related to hormones, or aging:
   - Women with hormonal skin changes, hot flashes, mood changes → Bioidentical Hormone Replacement ($250/month)
   - Men with fatigue, muscle loss, low energy → Testosterone Replacement Therapy ($225/month)
   - Thyroid-related skin/hair/energy issues → Thyroid Optimization ($200/month)
   - Always recommend starting with a Hormone Replacement Therapy Consultation ($200)
   - Recommend Hormone Panel Lab Work ($250) for baseline assessment
   - Hormone optimization enhances results of aesthetic treatments

   SCAR TREATMENT RECOMMENDATIONS:
   When the patient shows ANY type of scarring (acne scars, surgical scars, burn scars, keloids, hypertrophic scars, stretch marks, or post-inflammatory hyperpigmentation), you MUST recommend an appropriate scar treatment package from the catalog.
   
   SCAR TYPE CLASSIFICATION:
   - Ice Pick Scars: narrow, deep, V-shaped depressions (< 2mm wide) → Recommend Acne Scar packages
   - Boxcar Scars: wider depressions with defined vertical edges (1.5-4mm) → Recommend Acne Scar packages
   - Rolling Scars: broad, undulating depressions (> 4mm, tethered bands) → Recommend Acne Scar packages
   - Hypertrophic Scars: raised, firm, within wound boundaries → Recommend Hypertrophic Scar packages
   - Keloid Scars: raised, extending beyond wound boundaries, high recurrence → Recommend Keloid packages
   - Surgical/Traumatic Scars: linear or irregular from surgery/injury → Recommend Surgical Scar packages
   - Burn Scars: contracture, textural changes, dyspigmentation → Recommend Burn Scar packages
   - Stretch Marks (Striae Rubrae — red/new): → Recommend Stretch Mark packages
   - Stretch Marks (Striae Albae — white/old): → Recommend Stretch Mark Comprehensive
   - Post-Inflammatory Hyperpigmentation (PIH): flat dark marks → Recommend PIH packages
   
   PACKAGE SELECTION RULES:
   - Mild scarring → Recommend Starter/Basic package
   - Moderate scarring → Recommend Comprehensive package
   - Severe scarring → Recommend Premium package (when available)
   - For Fitzpatrick V-VI: NEVER recommend PIH Comprehensive (contains IPL). Use PIH Basic only.
   - For keloids: ALWAYS warn about recurrence risk and the need for maintenance
   - Multiple scar types can coexist — recommend packages for EACH type detected
   - If no scarring is detected, return an empty scarTreatments array

   HAIR RESTORATION RECOMMENDATIONS:
   When the patient shows hair thinning, hair loss, or receding hairline:
   - Mild to moderate thinning → Exosome Hair Therapy — Single Session ($1,200)
   - Moderate to advanced thinning → Exosome Hair Therapy — Pack of 3 ($3,000) for optimal results spaced 4-6 weeks apart
   - Combine with GHK-Cu peptide therapy for enhanced hair growth
   - DO NOT recommend PRP or PRF — this clinic does not offer these services

   CO2 LASER RESURFACING RECOMMENDATIONS:
   CO2 Laser is the most aggressive resurfacing option. Recommend for:
   - Deep wrinkles / severe photodamage → CO2 Laser - Full Face ($750)
   - Moderate-to-severe acne scarring → CO2 Laser - Full Face ($750)
   - Severe sun damage beyond IPL/peel scope → CO2 Laser
   - Neck lines / crepey neck → CO2 Laser - Neck Only ($500)
   - Combined face + neck aging → CO2 Laser - Face & Neck ($1,100)
   - CONTRAINDICATED for Fitzpatrick V-VI (high PIH risk) — use microneedling or peels instead
   - Requires 5-10 days downtime; must be done as standalone session
   - One CO2 session can equal 3-5 sessions of milder resurfacing treatments

   HIFU vs ULTHERAPY — WHEN TO RECOMMEND EACH:
   Both use focused ultrasound energy to lift and tighten skin, but they differ in precision and depth:
   
   HIFU (High-Intensity Focused Ultrasound):
   - Best for: Mild laxity, early jowling, preventive tightening, budget-conscious patients
   - Delivers energy at fixed depths without real-time imaging
   - Great maintenance treatment between more intensive procedures
   - Recommend for patients in their 30s-40s with early signs of laxity
   - Pricing: Full Face $450, Face & Neck $550, Jawline/Chin $350, Neck $300
   - Can be repeated every 6-12 months for maintenance
   
   ULTHERAPY (Micro-Focused Ultrasound with Visualization):
   - Best for: Moderate-to-significant laxity, visible jowls, sagging neck, brow drooping
   - Uses real-time ultrasound visualization to see tissue layers during treatment
   - Allows precise energy delivery at multiple depths (1.5mm, 3mm, 4.5mm)
   - The gold standard for precision ultrasound lifting
   - Recommend for patients 40+ with moderate laxity who want significant lifting
   - Pricing: Brow Lift $750, Lower Face $1,200, Full Face $1,800, Neck $1,200, Full Face & Neck $2,500, Decolletage $900, Full Face/Neck/Chest $3,200
   - Results build over 2-3 months as collagen remodels; can last 1-2 years
   
   COMBINATION STRATEGY:
   - For moderate laxity: Start with Ultherapy, then maintain with HIFU every 6-12 months
   - For mild laxity: Start with HIFU, upgrade to Ultherapy if more lifting is needed
   - Both pair well with RF Microneedling for skin texture + tightening
   - Both pair well with Sculptra/Radiesse for volume + lift

3. TREATMENT RECOMMENDATIONS — USE ONLY FROM THE CLINIC CATALOG BELOW
   - AT LEAST 3 facial treatments from the clinic's Facials menu (recommend 3 or more based on detected concerns)
   - 4 to 8 high-impact skin procedures from the clinic's service menu (MUST include HA fillers like Restylane/Juvederm when appropriate, and IPL for Fitzpatrick I-IV when sun damage/pigmentation/rosacea/vascular concerns are present)
   - SERIES STACKING: For each procedure, recommend a treatment series when appropriate (e.g., "3 sessions of RF Microneedling spaced 4 weeks apart" or "4-6 sessions of IPL every 3-4 weeks"). Explain why a series delivers better cumulative results than a single session. Include per-session AND total series pricing.
   - 5 to 7 skincare product recommendations — MUST be selected ONLY from the RadiantilyK Aesthetic Product Catalog below
   - Each product recommendation MUST include the exact product name, SKU code, and price from the catalog
   - Match products to the patient's specific detected conditions (e.g., recommend brightening serums for hyperpigmentation, peptide creams for aging)
   - ALWAYS recommend a sunscreen (EltaMD, BARUBT, or EELHOE) — sun protection is essential for every patient
   - If the patient is getting procedures, recommend a post-procedure recovery product (MOV Cellular Repair Mist, MOV Tina Regence Recovery Serum, Cosmedix or FactorFive kit) as part of their product regimen
   - Prioritize treatments based on the MOST CRITICAL issues first
   - Every single recommendation MUST be directly tied to a detected condition
   - Include the EXACT price from the catalog for each facial and procedure
   - You may also suggest relevant add-ons from the "Facial Add-Ons" section
   - If a membership would save the client money, mention the relevant membership option
   - When multiple recommended products match a bundle deal, ALWAYS suggest the bundle to save money
   - Never use generic spa language. Be specific and clinical.

4. NEXT-LEVEL INSIGHTS
   - Include predictive aging analysis based on current skin state
   - Provide skin trajectory modeling (where the skin is heading without intervention)
   - Give cellular-level explanations for detected conditions
   - These insights should feel advanced, intelligent, and next-generation

5. OPTIMIZATION ROADMAP
   - Create a phased improvement plan (typically 3-4 phases)
   - Each phase should have clear duration, goals, treatments (from the catalog), and expected outcomes
   - The roadmap should be realistic and progressive
   - Reference specific clinic services and their prices in the roadmap

6. TONE & STYLE
   - Premium, intelligent, and non-generic
   - Clinical precision mixed with luxury presentation
   - Never repetitive - each description must be unique and specific
   - Avoid phrases like "We noticed..." or "can help with this" - be direct and authoritative
   - Sound like a world-class dermatologist, not a spa receptionist

ABSOLUTE RULE: NEVER FABRICATE FINDINGS.
   - ONLY report conditions you can ACTUALLY SEE in the photo(s).
   - If you CANNOT clearly see wrinkles on the forehead, DO NOT report forehead wrinkles.
   - For each condition, specify the EXACT anatomical location (e.g., 'left nasolabial fold', 'outer corners of eyes', 'across the nose bridge'). Specify LEFT/RIGHT when applicable.
   - NEVER assume conditions based on age, skin type, or demographics.
   - A shorter, accurate report is better than a longer, fabricated one.
   - Before submitting, review every condition and ask: 'Did I actually see this in the photo?' Remove anything you're not confident about.

ABSOLUTE RULE: CLIENT/PATIENT CONCERNS ARE MANDATORY.
   When the patient has listed specific concerns, you MUST address EVERY SINGLE ONE:
   1. CONFIRM IT: If visible in photos, add it as a detected condition with correct severity and location.
   2. ACKNOWLEDGE IT: If subtle but plausible, include as "mild" severity with a note.
   3. RULE IT OUT: If genuinely not visible, mention in scoreJustification that the area looks healthy.
   
   CONCERN-TO-CONDITION MAPPING:
   - "Sagging & Loss of Volume" → cheek hollowing, temple hollowing, midface descent, jowling, skin laxity, nasolabial fold deepening
   - "Jawline & Chin Definition" → jowling, pre-jowl sulcus, submental fullness, loss of jawline contour. Side views are CRITICAL.
   - "General Anti-Aging" → fine lines, wrinkles, volume loss, skin laxity, texture changes, dullness
   - "Large Pores" → enlarged pores on nose, inner cheeks, forehead
   - "Wrinkles & Fine Lines" → forehead lines, crow's feet, glabella lines, nasolabial folds, marionette lines, perioral lines
   - "Acne & Breakouts" → active breakouts, comedones, papules, pustules
   - "Dark Spots & Hyperpigmentation" → sun spots, melasma, PIH, uneven tone
   - "Redness & Rosacea" → diffuse redness, broken capillaries, flushing
   - "Dark Circles" → under-eye hollowing, periorbital darkening, tear trough
   
   CONCERN-TO-TREATMENT MAPPING:
   - Jowling / jawline laxity → Ultherapy Lower Face, HIFU, Sculptra/Radiesse for jawline
   - Volume loss → Sculptra, Radiesse, Juvederm Voluma, Restylane Lyft
   - Sagging / laxity → Ultherapy, HIFU, RF Microneedling
   - Nasolabial folds → HA fillers (Restylane Lyft, Juvederm Vollure, RHA 3/4)
   - Fine lines / wrinkles → Neurotoxin, RF Microneedling, CO2 Laser
   
   FAILURE TO ADDRESS PATIENT CONCERNS IS THE #1 ACCURACY FAILURE.

IMPORTANT: Analyze the actual image(s) provided. Base your entire analysis on what you can LITERALLY SEE in the photos. Do not make up conditions that aren't visible. Be honest about image quality limitations.

${catalogText}

${productCatalogText}`;
}

export const SKIN_ANALYSIS_OUTPUT_SCHEMA = {
  name: "skin_analysis_report",
  strict: true,
  schema: {
    type: "object",
    required: [
      "scoreCalculation",
      "skinHealthScore",
      "scoreJustification",
      "skinType",
      "skinTone",
      "fitzpatrickType",
      "conditions",
      "positiveFindings",
      "missedConditions",
      "facialTreatments",
      "skinProcedures",
      "skincareProducts",
      "predictiveInsights",
      "skinTrajectory",
      "cellularAnalysis",
      "scarTreatments",
      "roadmap",
      "summary",
      "disclaimer"
    ],
    additionalProperties: false,
    properties: {
      scoreCalculation: {
        type: "string",
        description: "MANDATORY step-by-step score calculation. Format: 'Starting at 100. [Condition]: -[points]. ... [Positive]: +[points]. Final score: [number]'. The skinHealthScore MUST exactly match the final number here. NEVER skip this."
      },
      skinHealthScore: {
        type: "number",
        description: "The final number from scoreCalculation. MUST match exactly. MUST NOT be 68 — that number is banned. If calculation lands on 68, use 67 or 69."
      },
      scoreJustification: {
        type: "string",
        description: "Detailed explanation of why this specific score was given, referencing detected conditions and their impact."
      },
      skinType: {
        type: "string",
        description: "Detected skin type: Oily, Dry, Combination, Normal, or Sensitive"
      },
      skinTone: {
        type: "string",
        description: "Description of skin tone (e.g., 'Fair with warm undertones', 'Medium olive', 'Deep with cool undertones')"
      },
      fitzpatrickType: {
        type: "number",
        description: "Fitzpatrick skin type I-VI. CRITICAL: African American / Black patients are almost always Type V or VI. Dark brown skin = Type V minimum. Very dark skin = Type VI. When in doubt, choose the HIGHER number. NEVER classify clearly dark/brown skin as Type III or IV."
      },
      conditions: {
        type: "array",
        description: "ONLY conditions you can ACTUALLY SEE in the photo. Do NOT fabricate. Each must have exact anatomical location with LEFT/RIGHT specified.",
        items: {
          type: "object",
          required: ["name", "severity", "area", "description", "cellularInsight"],
          additionalProperties: false,
          properties: {
            name: { type: "string", description: "Condition name (e.g., 'Post-Inflammatory Hyperpigmentation', 'Atrophic Acne Scarring')" },
            severity: { type: "string", enum: ["mild", "moderate", "severe"], description: "Evidence-based severity level" },
            area: { type: "string", description: "Specific facial area(s) affected" },
            description: { type: "string", description: "Detailed, specific description of the condition as observed. No generic language." },
            cellularInsight: { type: "string", description: "Cellular-level explanation of what's happening beneath the surface" }
          }
        }
      },
      positiveFindings: {
        type: "array",
        items: { type: "string" },
        description: "Positive aspects of the skin health (good elasticity, hydration, etc.)"
      },
      missedConditions: {
        type: "array",
        description: "Conditions that standard analyzers typically miss but are detected here",
        items: {
          type: "object",
          required: ["name", "severity", "area", "description", "cellularInsight"],
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            severity: { type: "string", enum: ["mild", "moderate", "severe"] },
            area: { type: "string" },
            description: { type: "string" },
            cellularInsight: { type: "string" }
          }
        }
      },
      facialTreatments: {
        type: "array",
        description: "AT LEAST 3 facial treatments FROM THE CLINIC CATALOG, prioritized by impact. Must include exact price. Recommend 3 or more facials based on detected concerns.",
        items: {
          type: "object",
          required: ["name", "price", "reason", "targetConditions", "benefits", "priority"],
          additionalProperties: false,
          properties: {
            name: { type: "string", description: "Exact name from the clinic catalog" },
            price: { type: "string", description: "Exact price from the catalog (e.g., '$145')" },
            reason: { type: "string", description: "Why this facial is recommended, tied to specific detected conditions" },
            targetConditions: { type: "array", items: { type: "string" } },
            benefits: { type: "array", items: { type: "string" } },
            priority: { type: "number", description: "1 = highest priority" }
          }
        }
      },
      skinProcedures: {
        type: "array",
        description: "4 to 8 high-impact skin procedures FROM THE CLINIC CATALOG, prioritized. MUST include HA fillers (Restylane/Juvederm) when appropriate and IPL for Fitzpatrick I-IV. NEVER recommend Radiesse for under-eye area. Must include exact price. For each procedure, recommend a treatment series when appropriate and include series pricing.",
        items: {
          type: "object",
          required: ["name", "price", "reason", "targetConditions", "benefits", "expectedResults", "simulation", "priority"],
          additionalProperties: false,
          properties: {
            name: { type: "string", description: "Exact name from the clinic catalog" },
            price: { type: "string", description: "Exact price from the catalog (e.g., '$350')" },
            reason: { type: "string", description: "Clinical reasoning for this procedure" },
            targetConditions: { type: "array", items: { type: "string" } },
            benefits: { type: "array", items: { type: "string" } },
            expectedResults: { type: "string" },
            simulation: {
              type: "object",
              required: ["beforeDescription", "afterDescription", "improvementPercent", "timelineWeeks", "sessionsNeeded", "milestones"],
              additionalProperties: false,
              description: "Treatment simulation details",
              properties: {
                beforeDescription: { type: "string", description: "Current state of the treatment area" },
                afterDescription: { type: "string", description: "Expected state after treatment" },
                improvementPercent: { type: "number", description: "Estimated improvement 0-100" },
                timelineWeeks: { type: "number", description: "Weeks to full results" },
                sessionsNeeded: { type: "string", description: "Number of sessions needed for optimal results, e.g. '3-4 sessions spaced 4 weeks apart' or 'Series of 6 sessions every 3-4 weeks'. Always recommend a series when clinically appropriate." },
                milestones: {
                  type: "array",
                  description: "Progressive improvement milestones",
                  items: {
                    type: "object",
                    required: ["timepoint", "description", "improvementPercent"],
                    additionalProperties: false,
                    properties: {
                      timepoint: { type: "string" },
                      description: { type: "string" },
                      improvementPercent: { type: "number" }
                    }
                  }
                }
              }
            },
            priority: { type: "number" }
          }
        }
      },
      skincareProducts: {
        type: "array",
        description: "5-7 skincare product recommendations from the RadiantilyK Aesthetic Product Catalog. MUST include a sunscreen and a post-procedure product when procedures are recommended. Each MUST include exact SKU and price. When products match a bundle deal, mention the bundle.",
        items: {
          type: "object",
          required: ["name", "sku", "price", "type", "purpose", "keyIngredients", "targetConditions"],
          additionalProperties: false,
          properties: {
            name: { type: "string", description: "Exact product name from the catalog (e.g., 'RadiantilyK Aesthetic Vitamin C Facial Serum 30ml')" },
            sku: { type: "string", description: "Product SKU code from the catalog (e.g., 'RKA-010')" },
            price: { type: "string", description: "Exact price from the catalog (e.g., '$49.00')" },
            type: { type: "string", description: "Product category (Serum, Cream, Cleanser, Sunscreen, Post-Procedure, Trial Kit)" },
            purpose: { type: "string" },
            keyIngredients: { type: "array", items: { type: "string" } },
            targetConditions: { type: "array", items: { type: "string" } }
          }
        }
      },
      predictiveInsights: {
        type: "array",
        description: "Futuristic predictive insights about skin aging and trajectory",
        items: {
          type: "object",
          required: ["title", "description", "timeframe"],
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            timeframe: { type: "string", description: "e.g., '6-12 months', '2-5 years'" }
          }
        }
      },
      skinTrajectory: {
        type: "string",
        description: "Predictive analysis of where the skin is heading without intervention"
      },
      cellularAnalysis: {
        type: "string",
        description: "Overall cellular-level analysis of skin health, collagen status, and barrier function"
      },
      scarTreatments: {
        type: "array",
        description: "Scar treatment package recommendations. ONLY include if scarring is detected. Recommend appropriate packages from the Scar Treatment Packages section of the catalog. Match scar type to the correct package tier (Starter/Basic for mild, Comprehensive for moderate, Premium for severe). Return empty array if no scarring detected.",
        items: {
          type: "object",
          required: ["scarType", "packageName", "price", "sessions", "includes", "reason", "savings", "treatmentExplanations", "totalTimeline", "sessionSpacing", "firstResultsTimeline"],
          additionalProperties: false,
          properties: {
            scarType: { type: "string", description: "Type of scar: 'Acne Scar (Ice Pick)', 'Acne Scar (Boxcar)', 'Acne Scar (Rolling)', 'Hypertrophic', 'Keloid', 'Surgical/Traumatic', 'Burn Scar', 'Stretch Mark (Rubrae)', 'Stretch Mark (Albae)', 'PIH'" },
            packageName: { type: "string", description: "Exact package name from the catalog" },
            price: { type: "string", description: "Package price from the catalog" },
            sessions: { type: "number", description: "Total number of sessions in the package" },
            includes: { type: "array", items: { type: "string" }, description: "List of treatments included in the package" },
            reason: { type: "string", description: "Clinical reasoning for why this package is recommended for this patient's specific scarring" },
            savings: { type: "string", description: "How much the patient saves vs individual pricing" },
            treatmentExplanations: {
              type: "array",
              description: "For EACH treatment in 'includes', provide a clinical explanation of the mechanism of action.",
              items: {
                type: "object",
                required: ["name", "whatItDoes"],
                properties: {
                  name: { type: "string", description: "Treatment name (must match one of the 'includes' items)" },
                  whatItDoes: { type: "string", description: "Clinical explanation of how this treatment addresses the scar tissue. Example: 'Subcision uses a hypodermic needle to release fibrotic strands tethering the scar to underlying tissue, allowing dermal remodeling and surface elevation.'" }
                }
              }
            },
            totalTimeline: { type: "string", description: "Total treatment duration from first to last session plus healing. Example: '4-6 months for complete protocol'" },
            sessionSpacing: { type: "string", description: "Interval between sessions. Example: '4-6 weeks between sessions'" },
            firstResultsTimeline: { type: "string", description: "Expected timeline for initial visible improvement. Example: 'Visible improvement within 2-4 weeks post first session'" }
          }
        }
      },
      roadmap: {
        type: "array",
        description: "Phased skin optimization plan (3-4 phases) using clinic services with prices",
        items: {
          type: "object",
          required: ["phase", "title", "duration", "goals", "treatments", "expectedOutcome"],
          additionalProperties: false,
          properties: {
            phase: { type: "number" },
            title: { type: "string" },
            duration: { type: "string", description: "e.g., 'Weeks 1-4', 'Months 2-3'" },
            goals: { type: "array", items: { type: "string" } },
            treatments: { type: "array", items: { type: "string" }, description: "Specific clinic services with prices (e.g., 'RF Microneedling — $450')" },
            expectedOutcome: { type: "string" }
          }
        }
      },
      summary: {
        type: "string",
        description: "Executive summary of the analysis - premium, intelligent, and specific to this person's skin"
      },
      disclaimer: {
        type: "string",
        description: "Medical disclaimer that this is for informational purposes only and not a substitute for professional dermatological consultation"
      }
    }
  }
};
