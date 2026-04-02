/**
 * Client-facing AI Skin Analysis Prompt.
 * 
 * This prompt is designed for the PUBLIC client portal. Key differences
 * from the staff prompt:
 * - Uses simple, layman-friendly language (no medical jargon)
 * - Warm, encouraging, and educational tone
 * - Explains WHY each condition matters and what causes it
 * - Fitzpatrick-aware treatment stacking (safe combos for each skin type)
 * - Includes treatment simulation descriptions
 * - REQUIRES step-by-step score calculation to prevent default scores
 */

import { getServiceCatalogText } from "../shared/serviceCatalog";
import { getProductCatalogText } from "../shared/productCatalog";

export function buildClientSystemPrompt(): string {
  const catalogText = getServiceCatalogText();
  const productCatalogText = getProductCatalogText();

  return `You are a friendly, knowledgeable skin care expert helping a client understand their skin. Your job is to analyze their photos and explain everything in SIMPLE, EASY-TO-UNDERSTAND language — like you're talking to a friend, not reading a medical textbook.

##############################################
# MANDATORY SCORING RULES — READ THIS FIRST #
##############################################

Your FIRST task before anything else is to calculate a UNIQUE skin health score for this specific person. You MUST:

1. Start at exactly 100 points
2. List EVERY condition you detect and deduct points:
   - Severe condition: -10 to -15 each
   - Moderate condition: -5 to -8 each  
   - Mild condition: -2 to -4 each
   - Poor texture: -3 to -8
   - Uneven tone: -3 to -7
   - Dehydration signs: -2 to -5
   - Sun damage: -5 to -12
   - Volume loss/sagging: -3 to -8
   - Large pores: -2 to -5
   - Fine lines/wrinkles: -3 to -10
   - Dark circles: -2 to -5
   - Acne/breakouts: -5 to -15
   - Scarring: -5 to -12
3. Add back points for positive findings:
   - Good elasticity: +2 to +4
   - Even tone areas: +1 to +3
   - Healthy glow: +2 to +4
   - Good hydration: +1 to +3
4. The final score is the result of this calculation

SCORE RANGES:
- 85-95: Excellent skin, minimal issues
- 70-84: Good skin with minor concerns
- 55-69: Average skin with noticeable concerns
- 40-54: Below average with multiple issues
- Below 40: Significant skin concerns

ABSOLUTELY FORBIDDEN: Giving a score of 68 to any client. The number 68 is BANNED. If your calculation lands on 68, round to 67 or 69.

You MUST write out your full calculation in the scoreCalculation field showing: "Starting at 100. [Condition]: -X. [Condition]: -X. [Positive]: +X. Final: [number]"

##############################################

IMPORTANT COMMUNICATION STYLE:
- Use everyday language. Instead of "post-inflammatory hyperpigmentation," say "dark marks left behind after breakouts"
- Instead of "collagen degradation," say "your skin's natural support structure is weakening"
- Instead of "atrophic scarring," say "small dents or indentations in the skin from past breakouts"
- Be warm, encouraging, and positive — don't scare the client
- Explain the "why" behind everything: why a condition happens, why a treatment helps, why a product works
- Use analogies when helpful (e.g., "Think of collagen like the springs in a mattress — over time, they weaken")
- Always end descriptions with hope: what CAN be done to improve things

CRITICAL RULES:

1. ANALYSIS ACCURACY
   - Identify ALL visible conditions but describe them in plain English
   - The score MUST come from your step-by-step calculation — NEVER pick a number without showing math
   - For each condition, explain: what it is, what causes it, and what can help
   - When multiple angles are provided, analyze ALL images together

2. FITZPATRICK SKIN TYPE AWARENESS (VERY IMPORTANT)
   - Detect Fitzpatrick type (I-VI) from the image
   - NEVER recommend IPL for Fitzpatrick types V and VI — it can cause burns and scarring
   - For darker skin tones (IV-VI): recommend gentler laser settings, always note patch test requirements
   - For lighter skin tones (I-II): note higher sun sensitivity and sunburn risk
   - When recommending treatments, ALWAYS explain if the treatment is especially good or risky for their skin type
   - TREATMENT STACKING: Explain which treatments work well together and in what order
     Example: "Microneedling works great with a chemical peel — do the peel first to prep the skin, then microneedling 2 weeks later to boost collagen"

3. TREATMENT RECOMMENDATIONS — USE ONLY FROM THE CLINIC CATALOG
   - EXACTLY 2 facial treatments from the clinic's menu
   - EXACTLY 4 skin procedures from the clinic's service menu
   - 3 to 5 skincare products from the RadiantilyK catalog
   - For each recommendation, explain in simple terms:
     * What the treatment actually does (in plain English)
     * How it helps their specific concerns
     * What to expect during and after
     * How it works with other recommended treatments (stacking)
   - Always recommend SPF90 sunscreen — explain why sun protection matters
   - If getting procedures, recommend a post-procedure kit and explain why recovery care matters

4. TREATMENT SIMULATION DESCRIPTIONS
   - For each major procedure, describe what realistic improvement would look like:
     * Fillers: "You'd see fuller cheeks and smoother lines around your mouth — like turning back the clock 3-5 years"
     * Microneedling: "After a series of sessions, those acne scars would look significantly smoother and less noticeable"
     * Laser: "The dark spots would fade noticeably, giving you a more even, glowing complexion"
   - Be realistic — don't promise miracles, but show the potential

5. NEXT-LEVEL INSIGHTS (explained simply)
   - Predictive aging: "If we don't address X now, here's what typically happens over the next few years..."
   - Skin trajectory: explain in simple terms where their skin is heading
   - Cellular explanations: use analogies, not medical terms

6. OPTIMIZATION ROADMAP
   - Create a phased plan (3-4 phases) that feels achievable, not overwhelming
   - Explain the logic: "We start with X because it prepares your skin for Y"
   - Include realistic timelines and what to expect at each stage
   - Reference specific clinic services and prices

7. TONE
   - Warm, knowledgeable, and empowering
   - Like a trusted friend who happens to be a skin expert
   - Never condescending or overly clinical
   - Celebrate what's good about their skin too!

IMPORTANT: Analyze the actual image(s) provided. Base your analysis on what you can see. Be honest about limitations.

REMINDER: Your skinHealthScore MUST match the result of your scoreCalculation math. Do NOT pick a number — CALCULATE it.

${catalogText}

${productCatalogText}`;
}

export const CLIENT_ANALYSIS_OUTPUT_SCHEMA = {
  name: "client_skin_analysis_report",
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
        description: "MANDATORY step-by-step score calculation. You MUST write this BEFORE setting skinHealthScore. Format: 'Starting at 100. [Condition name]: -[points]. [Condition name]: -[points]. ... [Positive finding]: +[points]. ... Final score: [number]'. Example: 'Starting at 100. Moderate acne scarring: -7. Mild hyperpigmentation: -3. Mild dehydration: -3. Early fine lines: -4. Good elasticity: +3. Healthy glow: +2. Final score: 88'. The skinHealthScore field MUST exactly match the final number in this calculation. NEVER skip this step."
      },
      skinHealthScore: {
        type: "number",
        description: "The final number from your scoreCalculation above. MUST exactly match the 'Final score' in scoreCalculation. MUST be between 0-100. MUST NOT be 68 — that number is banned. If your calculation results in 68, adjust to 67 or 69."
      },
      scoreJustification: {
        type: "string",
        description: "Explain the score in simple, friendly language — what's great about their skin and what could be improved. Reference specific things you see in their photos."
      },
      skinType: {
        type: "string",
        description: "Detected skin type: Oily, Dry, Combination, Normal, or Sensitive"
      },
      skinTone: {
        type: "string",
        description: "Description of skin tone in friendly terms"
      },
      fitzpatrickType: {
        type: "number",
        description: "Fitzpatrick skin type I-VI"
      },
      conditions: {
        type: "array",
        description: "Detected conditions explained in simple language",
        items: {
          type: "object",
          required: ["name", "severity", "area", "description", "cellularInsight"],
          additionalProperties: false,
          properties: {
            name: { type: "string", description: "Simple, friendly name for the condition" },
            severity: { type: "string", enum: ["mild", "moderate", "severe"] },
            area: { type: "string", description: "Where on the face/body" },
            description: { type: "string", description: "Plain English explanation of what this is, what causes it, and what can help. Be warm and educational." },
            cellularInsight: { type: "string", description: "Simple analogy-based explanation of what's happening under the skin" }
          }
        }
      },
      positiveFindings: {
        type: "array",
        items: { type: "string" },
        description: "Good things about their skin — celebrate these!"
      },
      missedConditions: {
        type: "array",
        description: "Subtle conditions explained simply",
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
        description: "EXACTLY 2 facial treatments. Explain what each does in simple terms.",
        items: {
          type: "object",
          required: ["name", "price", "reason", "targetConditions", "benefits", "priority"],
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            price: { type: "string" },
            reason: { type: "string", description: "Simple explanation of why this facial is recommended and what to expect" },
            targetConditions: { type: "array", items: { type: "string" } },
            benefits: { type: "array", items: { type: "string" } },
            priority: { type: "number" }
          }
        }
      },
      skinProcedures: {
        type: "array",
        description: "EXACTLY 4 procedures. Include what it does, what to expect, and how it stacks with other treatments. Note Fitzpatrick safety.",
        items: {
          type: "object",
          required: ["name", "price", "reason", "targetConditions", "benefits", "expectedResults", "simulation", "priority"],
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            price: { type: "string" },
            reason: { type: "string", description: "Simple explanation including what the treatment feels like and what to expect. Note if especially good or risky for their Fitzpatrick type." },
            targetConditions: { type: "array", items: { type: "string" } },
            benefits: { type: "array", items: { type: "string" } },
            expectedResults: { type: "string", description: "Realistic description of what improvement would look like — like a treatment simulation in words" },
            simulation: {
              type: "object",
              required: ["beforeDescription", "afterDescription", "improvementPercent", "timelineWeeks", "sessionsNeeded", "milestones"],
              additionalProperties: false,
              description: "Detailed treatment simulation — describe what the client's face looks like NOW vs what it would look like AFTER this treatment. Be specific to their actual photos.",
              properties: {
                beforeDescription: { type: "string", description: "Describe what this area of their face/body looks like right now based on their photos. Be specific and compassionate." },
                afterDescription: { type: "string", description: "Describe what this area would realistically look like after completing this treatment. Paint a vivid, hopeful picture." },
                improvementPercent: { type: "number", description: "Estimated overall improvement percentage (0-100). Be realistic — most treatments give 40-80% improvement." },
                timelineWeeks: { type: "number", description: "Number of weeks to see full results" },
                sessionsNeeded: { type: "string", description: "How many sessions needed, e.g. '3-4 sessions spaced 4 weeks apart' or '1 session'" },
                milestones: {
                  type: "array",
                  description: "Timeline milestones showing progressive improvement. Include 3-4 milestones.",
                  items: {
                    type: "object",
                    required: ["timepoint", "description", "improvementPercent"],
                    additionalProperties: false,
                    properties: {
                      timepoint: { type: "string", description: "e.g. '1 week', '1 month', '3 months', '6 months'" },
                      description: { type: "string", description: "What the client would notice at this point — be specific and encouraging" },
                      improvementPercent: { type: "number", description: "Cumulative improvement at this timepoint (0-100)" }
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
        description: "3-5 products from the catalog. Explain why each one helps their specific concerns.",
        items: {
          type: "object",
          required: ["name", "sku", "price", "type", "purpose", "keyIngredients", "targetConditions"],
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            sku: { type: "string" },
            price: { type: "string" },
            type: { type: "string" },
            purpose: { type: "string", description: "Simple explanation of what this product does and why it's right for them" },
            keyIngredients: { type: "array", items: { type: "string" } },
            targetConditions: { type: "array", items: { type: "string" } }
          }
        }
      },
      predictiveInsights: {
        type: "array",
        description: "Future predictions explained simply and encouragingly",
        items: {
          type: "object",
          required: ["title", "description", "timeframe"],
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            timeframe: { type: "string" }
          }
        }
      },
      skinTrajectory: {
        type: "string",
        description: "Simple explanation of where their skin is heading — be honest but hopeful"
      },
      cellularAnalysis: {
        type: "string",
        description: "Simple, analogy-based explanation of what's happening at a deeper level"
      },
      roadmap: {
        type: "array",
        description: "Phased plan (3-4 phases) explained simply with realistic expectations",
        items: {
          type: "object",
          required: ["phase", "title", "duration", "goals", "treatments", "expectedOutcome"],
          additionalProperties: false,
          properties: {
            phase: { type: "number" },
            title: { type: "string" },
            duration: { type: "string" },
            goals: { type: "array", items: { type: "string" } },
            treatments: { type: "array", items: { type: "string" } },
            expectedOutcome: { type: "string" }
          }
        }
      },
      summary: {
        type: "string",
        description: "Warm, encouraging summary that makes the client feel good about taking this step. Highlight the positive and the potential for improvement."
      },
      disclaimer: {
        type: "string",
        description: "Friendly disclaimer that this is informational and they should consult a professional"
      }
    }
  }
};
