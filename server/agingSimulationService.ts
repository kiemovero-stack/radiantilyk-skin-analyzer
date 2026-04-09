/**
 * Future Aging Self Simulation Service
 *
 * Uses OpenAI's gpt-image-1 model to generate two images:
 * 1. What the client will look like in 20 years WITHOUT treatment
 * 2. What the client will look like in 20 years WITH recommended treatments
 *
 * This creates a powerful emotional motivator — clients see the difference
 * that proactive treatment makes over time.
 *
 * Flow:
 * 1. Takes the client's uploaded front-facing photo
 * 2. Generates "aged without treatment" image
 * 3. Generates "aged with treatment" image
 * 4. Stores both in S3
 * 5. Updates the database with URLs
 */
import { ENV } from "./_core/env";
import { storagePut } from "./storage";

interface AgingSimulationRequest {
  /** S3 URL of the client's front-facing photo */
  sourceImageUrl: string;
  /** Pre-downloaded source image buffer */
  sourceBuffer: Buffer;
  /** Client's Fitzpatrick skin type (1-6) */
  fitzpatrickType: number;
  /** Client's current age (estimated or from DOB) */
  currentAge?: number;
  /** Skin health score from analysis */
  skinHealthScore: number;
  /** Key conditions detected */
  conditions: string[];
  /** Recommended treatments */
  treatments: string[];
  /** Analysis ID for organizing storage */
  analysisId: number;
}

interface AgingSimulationResult {
  withoutTreatmentUrl: string;
  withTreatmentUrl: string;
  success: boolean;
  error?: string;
}

const fitzDescriptions: Record<number, string> = {
  1: "very fair skin (Fitzpatrick Type I) that burns easily and shows aging primarily through fine lines, deep wrinkles, and sun spots",
  2: "fair skin (Fitzpatrick Type II) that shows aging through wrinkles, age spots, and loss of elasticity",
  3: "medium skin (Fitzpatrick Type III) that shows aging through moderate wrinkles, uneven tone, and some volume loss",
  4: "olive/moderate brown skin (Fitzpatrick Type IV) that shows aging through volume loss, nasolabial folds, and mild hyperpigmentation",
  5: "dark brown skin (Fitzpatrick Type V) that shows aging primarily through volume loss, deepened folds, and uneven skin tone rather than fine wrinkles",
  6: "deeply pigmented dark skin (Fitzpatrick Type VI) that shows aging through volume loss, deepened expression lines, and changes in skin texture rather than fine wrinkles",
};

/**
 * Build the prompt for the "aged WITHOUT treatment" image.
 * Shows natural aging progression — realistic but motivating.
 */
function buildWithoutTreatmentPrompt(req: AgingSimulationRequest): string {
  const skinDesc = fitzDescriptions[req.fitzpatrickType] || "medium skin tone";
  const yearsToAge = 20;
  
  const conditionProgression = req.conditions.length > 0
    ? `Their current skin concerns (${req.conditions.slice(0, 5).join(", ")}) will have progressed and worsened over time.`
    : "";

  return `You are editing a real person's photo to show what they would realistically look like ${yearsToAge} years from now if they do NOT pursue any aesthetic treatments or advanced skincare.

This person has ${skinDesc}.

Show REALISTIC, NATURAL aging progression for ${yearsToAge} years:
- Deepen existing wrinkles and add new age-appropriate wrinkles (forehead lines, crow's feet, nasolabial folds, marionette lines)
- Add visible volume loss in the cheeks, temples, and under-eye area
- Show mild skin laxity along the jawline and neck
- Add age spots, sun damage progression, and uneven skin tone appropriate for their skin type
- Show thinning of the lips and slight downturning of mouth corners
- Hair should show some graying at the temples
- Skin should look less luminous and more dull/tired
${conditionProgression}

CRITICAL RULES:
1) The person MUST be 100% recognizable — same identity, bone structure, hair style (with aging changes), clothing, background, lighting, and camera angle
2) The aging must look NATURAL and REALISTIC — like a real photograph taken ${yearsToAge} years later, NOT like a horror movie or caricature
3) Changes should be significant enough to be motivating but not exaggerated or frightening
4) Keep the same expression, pose, and overall composition
5) The result must look like a real photograph of a real person who has aged naturally
6) Do NOT add dramatic weight changes — keep the same general body type
7) The aging should be believable for someone who does basic skincare but no professional treatments`;
}

/**
 * Build the prompt for the "aged WITH treatment" image.
 * Shows aging with proactive aesthetic care — still aged, but gracefully.
 */
function buildWithTreatmentPrompt(req: AgingSimulationRequest): string {
  const skinDesc = fitzDescriptions[req.fitzpatrickType] || "medium skin tone";
  const yearsToAge = 20;
  
  const treatmentBenefits = req.treatments.length > 0
    ? `They have been maintaining regular treatments including ${req.treatments.slice(0, 4).join(", ")}, which have slowed visible aging.`
    : "They have been maintaining regular aesthetic treatments which have slowed visible aging.";

  return `You are editing a real person's photo to show what they would realistically look like ${yearsToAge} years from now if they CONSISTENTLY pursue aesthetic treatments and advanced skincare.

This person has ${skinDesc}. ${treatmentBenefits}

Show GRACEFUL, WELL-MAINTAINED aging for ${yearsToAge} years:
- Some wrinkles are present but significantly softer than untreated aging — forehead lines are mild, crow's feet are minimal
- Good volume retention in cheeks and temples (thanks to fillers/Sculptra over the years)
- Jawline remains relatively defined with minimal sagging
- Skin tone is more even with fewer age spots (thanks to regular laser/IPL treatments)
- Lips maintain reasonable volume and shape
- Skin has a healthier, more luminous quality — still has texture but looks well-cared-for
- Hair shows some natural graying but looks healthy
- Under-eye area shows mild hollowing but not severe
- Overall impression: "They look amazing for their age" — aged but gracefully

CRITICAL RULES:
1) The person MUST be 100% recognizable — same identity, bone structure, hair style (with aging changes), clothing, background, lighting, and camera angle
2) They MUST still look ${yearsToAge} years older — NOT the same age. This is NOT an anti-aging filter
3) The difference from the "without treatment" version should be noticeable but subtle — they look like someone who takes great care of themselves, NOT like they haven't aged at all
4) Keep the same expression, pose, and overall composition
5) The result must look like a real photograph of a real person — NOT airbrushed or filtered
6) Do NOT make them look younger than their age — make them look like the BEST version of their future self
7) The skin should still have natural texture, pores, and some imperfections — just fewer and less severe`;
}

/**
 * Generate a single aging simulation image.
 */
async function generateAgingImage(
  sourceBuffer: Buffer,
  prompt: string,
  analysisId: number,
  label: string
): Promise<{ url: string; success: boolean; error?: string }> {
  const apiKey = ENV.openaiApiKey;
  if (!apiKey) {
    return { url: "", success: false, error: "OpenAI API key not configured" };
  }

  const maxRetries = 2;
  let lastError = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[AgingSim] Retry ${attempt}/${maxRetries} for ${label} (analysis ${analysisId})`);
        await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
      }

      console.log(`[AgingSim] Generating ${label} for analysis ${analysisId} (attempt ${attempt + 1})`);

      const formData = new FormData();
      formData.append("model", "gpt-image-1");
      formData.append("prompt", prompt);
      formData.append(
        "image[]",
        new Blob([new Uint8Array(sourceBuffer)], { type: "image/png" }),
        "source.png"
      );
      formData.append("size", "1024x1024");
      formData.append("quality", "high");
      formData.append("input_fidelity", "high");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 150000); // 2.5 minute timeout

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 && attempt < maxRetries) {
          console.warn(`[AgingSim] Rate limited for ${label}, will retry...`);
          lastError = `Rate limited: ${response.status}`;
          continue;
        }
        throw new Error(`OpenAI API error (${response.status}): ${errorText.substring(0, 300)}`);
      }

      const result = await response.json();
      const b64Data = result.data?.[0]?.b64_json;

      if (!b64Data) {
        throw new Error("No image data returned from OpenAI");
      }

      const imageBuffer = Buffer.from(b64Data, "base64");
      const storageKey = `aging/${analysisId}/${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.png`;

      const { url } = await storagePut(storageKey, imageBuffer, "image/png");

      console.log(`[AgingSim] Successfully generated ${label} → ${storageKey}`);

      return { url, success: true };
    } catch (error: any) {
      lastError = error?.message || "Unknown error";
      if (error?.name === "AbortError") {
        lastError = "Request timed out after 150s";
      }
      if (attempt < maxRetries) {
        console.warn(`[AgingSim] Attempt ${attempt + 1} failed for ${label}: ${lastError}`);
        continue;
      }
    }
  }

  console.error(`[AgingSim] Failed to generate ${label} after ${maxRetries + 1} attempts: ${lastError}`);
  return { url: "", success: false, error: lastError };
}

/**
 * Estimate age from DOB string (format: YYYY-MM-DD or MM/DD/YYYY).
 */
function estimateAge(dob: string): number | undefined {
  if (!dob) return undefined;
  try {
    const date = new Date(dob);
    if (isNaN(date.getTime())) return undefined;
    const ageDiff = Date.now() - date.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch {
    return undefined;
  }
}

/**
 * Generate both aging simulation images (with and without treatment).
 * Runs both in parallel for speed.
 */
export async function generateAgingSimulations(
  analysisId: number,
  sourceImageUrl: string,
  fitzpatrickType: number,
  skinHealthScore: number,
  conditions: string[],
  treatments: string[],
  patientDob?: string
): Promise<AgingSimulationResult> {
  if (!ENV.openaiApiKey) {
    console.warn("[AgingSim] OpenAI API key not configured, skipping aging simulations");
    return { withoutTreatmentUrl: "", withTreatmentUrl: "", success: false, error: "No API key" };
  }

  // Download source image once
  let sourceBuffer: Buffer;
  try {
    console.log(`[AgingSim] Downloading source image for analysis ${analysisId}...`);
    const sourceResp = await fetch(sourceImageUrl);
    if (!sourceResp.ok) {
      throw new Error(`Failed to download source image: ${sourceResp.status}`);
    }
    sourceBuffer = Buffer.from(await sourceResp.arrayBuffer());
    console.log(`[AgingSim] Source image downloaded (${(sourceBuffer.length / 1024).toFixed(0)}KB)`);
  } catch (err: any) {
    console.error(`[AgingSim] Cannot download source image: ${err?.message}`);
    return { withoutTreatmentUrl: "", withTreatmentUrl: "", success: false, error: err?.message };
  }

  const currentAge = patientDob ? estimateAge(patientDob) : undefined;

  const req: AgingSimulationRequest = {
    sourceImageUrl,
    sourceBuffer,
    fitzpatrickType,
    currentAge,
    skinHealthScore,
    conditions,
    treatments,
    analysisId,
  };

  const withoutPrompt = buildWithoutTreatmentPrompt(req);
  const withPrompt = buildWithTreatmentPrompt(req);

  // Generate both images in parallel
  console.log(`[AgingSim] Starting parallel aging simulation for analysis ${analysisId}`);

  const [withoutResult, withResult] = await Promise.all([
    generateAgingImage(sourceBuffer, withoutPrompt, analysisId, "without-treatment"),
    generateAgingImage(sourceBuffer, withPrompt, analysisId, "with-treatment"),
  ]);

  const success = withoutResult.success && withResult.success;
  const partialSuccess = withoutResult.success || withResult.success;

  if (success) {
    console.log(`[AgingSim] Both aging images generated successfully for analysis ${analysisId}`);
  } else if (partialSuccess) {
    console.warn(`[AgingSim] Partial success for analysis ${analysisId}: without=${withoutResult.success}, with=${withResult.success}`);
  } else {
    console.error(`[AgingSim] Both aging images failed for analysis ${analysisId}`);
  }

  return {
    withoutTreatmentUrl: withoutResult.url,
    withTreatmentUrl: withResult.url,
    success: success || partialSuccess,
    error: success ? undefined : `without: ${withoutResult.error || "ok"}, with: ${withResult.error || "ok"}`,
  };
}

export { estimateAge };
