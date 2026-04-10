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
  1: "very fair, porcelain-like complexion (Fitzpatrick Type I) — ages with fine crosshatch wrinkles, prominent sun spots and solar lentigines, visible capillaries, and thin translucent skin",
  2: "fair skin with light warm undertones (Fitzpatrick Type II) — ages with moderate wrinkles, freckling that darkens into age spots, crow's feet, and gradual loss of cheek volume",
  3: "medium skin with warm/neutral undertones (Fitzpatrick Type III) — ages with moderate wrinkles concentrated around eyes and mouth, some melasma, and gradual volume deflation in the midface",
  4: "olive to moderate brown skin (Fitzpatrick Type IV) — ages primarily through volume loss in temples and cheeks, deepening nasolabial folds, mild hyperpigmentation patches, and jowling rather than fine wrinkles",
  5: "rich brown skin (Fitzpatrick Type V) — ages primarily through volume loss, deepened expression folds, under-eye hollowing, and uneven skin tone rather than fine surface wrinkles",
  6: "deep brown to ebony skin (Fitzpatrick Type VI) — ages through volume deflation, deepened nasolabial and marionette folds, periorbital hollowing, and textural changes rather than fine wrinkles",
};

/**
 * Build the prompt for the "aged WITHOUT treatment" image.
 * Hyper-focused on photorealism and natural human appearance.
 */
function buildWithoutTreatmentPrompt(req: AgingSimulationRequest): string {
  const skinDesc = fitzDescriptions[req.fitzpatrickType] || "medium skin tone";
  const yearsToAge = 20;
  const futureAge = req.currentAge ? `${req.currentAge + yearsToAge}` : `${yearsToAge} years older`;
  
  const conditionProgression = req.conditions.length > 0
    ? `Their existing skin concerns — ${req.conditions.slice(0, 4).join(", ")} — have naturally worsened over the decades without intervention.`
    : "";

  return `TASK: Edit this photograph to realistically age this person by ${yearsToAge} years, showing them at approximately age ${futureAge} with NO aesthetic treatments or professional skincare.

SUBJECT: This person has ${skinDesc}.

PHOTOREALISM IS THE #1 PRIORITY. The output must be indistinguishable from a real photograph taken with the same camera, in the same room, with the same lighting — just ${yearsToAge} years later.

AGING CHANGES TO APPLY (subtle, cumulative, realistic):
• Forehead: horizontal lines deepened into permanent creases, slight brow descent
• Eyes: crow's feet extending outward, upper eyelid hooding, mild under-eye bags with shadowing, slight orbital bone visibility
• Midface: flattened cheeks from fat pad descent, deepened nasolabial folds, subtle jowling beginning at jawline
• Mouth: vertical lip lines, thinner lips, mild marionette lines, slight downward pull at corners
• Skin surface: larger pores, uneven texture, scattered age spots and sun damage appropriate for their skin type, loss of the "lit from within" glow, slightly sallow or dull undertone
• Neck: horizontal neck lines (necklace lines), mild skin laxity
• Hair: natural graying — salt-and-pepper at temples, thinner overall density, same style but slightly less volume
• Overall: skin appears drier, less plump, with visible loss of collagen — the face looks "deflated" compared to now
${conditionProgression}

ABSOLUTE REQUIREMENTS FOR PHOTOREALISM:
1. PRESERVE IDENTITY EXACTLY — same person, same bone structure, same facial proportions, same eye color, same nose shape. They must be immediately recognizable.
2. PRESERVE THE PHOTOGRAPH — identical lighting, background, camera angle, focal length, white balance, image noise/grain pattern, clothing, accessories, and composition. Do NOT change anything about the photo except the face and visible skin.
3. NATURAL SKIN TEXTURE — real skin has pores, fine peach fuzz, subtle redness around the nose, visible blood vessels. Keep all of these. Do NOT smooth the skin. Do NOT make it look filtered or processed.
4. NO AI ARTIFACTS — no plastic/waxy look, no uncanny valley effect, no overly smooth gradients, no unnatural symmetry, no blurred edges around features, no painted appearance. Every pixel should look like it came from a camera sensor.
5. SUBTLE NOT DRAMATIC — this is ${yearsToAge} years of normal aging, not a horror transformation. The changes should feel inevitable and natural, like looking at a family member who you haven't seen in years.
6. KEEP THE SAME EXPRESSION — same slight smile or neutral expression. Do not change their emotional state.
7. PHOTOGRAPHIC QUALITY — maintain the exact same image quality, resolution feel, depth of field, and color grading as the original photo.`;
}

/**
 * Build the prompt for the "aged WITH treatment" image.
 * Shows aging with proactive aesthetic care — still aged, but gracefully.
 */
function buildWithTreatmentPrompt(req: AgingSimulationRequest): string {
  const skinDesc = fitzDescriptions[req.fitzpatrickType] || "medium skin tone";
  const yearsToAge = 20;
  const futureAge = req.currentAge ? `${req.currentAge + yearsToAge}` : `${yearsToAge} years older`;
  
  const treatmentList = req.treatments.length > 0
    ? req.treatments.slice(0, 4).join(", ")
    : "neurotoxin, dermal fillers, laser resurfacing, and medical-grade skincare";

  return `TASK: Edit this photograph to realistically age this person by ${yearsToAge} years, showing them at approximately age ${futureAge} — BUT this version shows someone who has CONSISTENTLY maintained professional aesthetic treatments (${treatmentList}) throughout those ${yearsToAge} years.

SUBJECT: This person has ${skinDesc}.

PHOTOREALISM IS THE #1 PRIORITY. The output must be indistinguishable from a real photograph.

AGING CHANGES TO APPLY (graceful, well-maintained aging):
• Forehead: lines present but softened — not frozen, just less deep (consistent neurotoxin use)
• Eyes: minimal crow's feet, no significant hooding, under-eye area shows mild hollowing but no heavy bags (filler maintenance)
• Midface: cheeks retain good volume and lift, nasolabial folds present but shallow (regular filler and Sculptra)
• Mouth: lips maintain reasonable fullness and definition, minimal marionette lines
• Jawline: remains relatively defined with minimal jowling (skin tightening treatments)
• Skin surface: more even tone, fewer age spots (regular laser/IPL), finer texture, skin looks hydrated and has a subtle healthy luminosity — but still has real pores, real texture, real imperfections
• Neck: fewer horizontal lines, better skin quality than untreated
• Hair: same natural graying pattern — salt-and-pepper at temples, but hair looks healthy and well-maintained
• Overall: they look their age but like someone who "takes incredible care of themselves" — the kind of person others ask "what's your secret?" They do NOT look 25 — they look like a ${futureAge}-year-old who has aged exceptionally well.

ABSOLUTE REQUIREMENTS FOR PHOTOREALISM:
1. PRESERVE IDENTITY EXACTLY — same person, same bone structure, same facial proportions, same eye color, same nose shape. Immediately recognizable as the same individual.
2. PRESERVE THE PHOTOGRAPH — identical lighting, background, camera angle, focal length, white balance, image noise/grain, clothing, accessories, and composition.
3. THEY MUST STILL LOOK ${yearsToAge} YEARS OLDER — this is NOT a beauty filter or de-aging effect. They have clearly aged. The difference from the "without treatment" version is that the aging is softer, more graceful, and better maintained — NOT that they look younger than their age.
4. NATURAL SKIN TEXTURE — real pores, real skin texture, subtle imperfections. The skin looks healthy and well-cared-for but NOT airbrushed, NOT poreless, NOT filtered. Think "great skincare routine" not "Instagram filter."
5. NO AI ARTIFACTS — no plastic/waxy appearance, no uncanny valley, no overly smooth gradients, no painted look, no blurred feature edges, no unnatural perfection. Every pixel must look photographic.
6. KEEP THE SAME EXPRESSION — same slight smile or neutral expression.
7. THE DIFFERENCE SHOULD BE BELIEVABLE — when compared side-by-side with the "without treatment" version, the viewer should think "wow, the treatments really made a difference" not "that looks fake." The improvement should be aspirational but credible.
8. PHOTOGRAPHIC QUALITY — maintain exact same image quality, resolution feel, depth of field, and color grading as the original.`;
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
