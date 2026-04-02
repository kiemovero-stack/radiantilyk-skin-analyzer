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
   - Use this scoring rubric: Start at 100, deduct points for each condition based on severity (severe: -10 to -15, moderate: -5 to -8, mild: -2 to -4), then deduct for texture issues, uneven tone, dehydration, sun damage, and volume loss. Add back points for positive findings.
   - Score ranges: Excellent skin (85-95), Good skin with minor issues (70-84), Average with concerns (55-69), Below average with multiple issues (35-54), Poor condition (below 35)
   - The score MUST be different for every patient based on their actual skin. Show your calculation in scoreJustification.
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
   - NEVER recommend IPL for Fitzpatrick types V and VI — it can cause burns and scarring
   - For Fitzpatrick V-VI: only recommend Nd:YAG or Pico lasers (safe for darker skin). Always note patch test requirements. Chemical peels should be superficial only.
   - For darker skin tones, recommend gentler laser settings and always note patch test requirements

3. TREATMENT RECOMMENDATIONS — USE ONLY FROM THE CLINIC CATALOG BELOW
   - EXACTLY 2 facial treatments from the clinic's Facials menu (no more, no less)
   - EXACTLY 4 high-impact skin procedures from the clinic's service menu (no more, no less)
   - 3 to 5 skincare product recommendations — MUST be selected ONLY from the RadiantilyK Aesthetic Product Catalog below
   - Each product recommendation MUST include the exact product name, SKU code, and price from the catalog
   - Match products to the patient's specific detected conditions (e.g., recommend brightening serums for hyperpigmentation, peptide creams for aging)
   - Always recommend the EELHOE Sun Cream SPF90 ($22.00) as one of the products — sun protection is essential for every patient
   - If the patient is getting procedures, recommend a post-procedure kit (Cosmedix or FactorFive) as part of their product regimen
   - Prioritize treatments based on the MOST CRITICAL issues first
   - Every single recommendation MUST be directly tied to a detected condition
   - Include the EXACT price from the catalog for each facial and procedure
   - You may also suggest relevant add-ons from the "Facial Add-Ons" section
   - If a membership would save the client money, mention the relevant membership option
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
        description: "EXACTLY 2 facial treatments FROM THE CLINIC CATALOG, prioritized by impact. Must include exact price.",
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
        description: "EXACTLY 4 high-impact skin procedures FROM THE CLINIC CATALOG, prioritized. Must include exact price.",
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
                sessionsNeeded: { type: "string", description: "Number of sessions needed" },
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
        description: "3-5 skincare product recommendations from the RadiantilyK Aesthetic Product Catalog. Each MUST include exact SKU and price.",
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
