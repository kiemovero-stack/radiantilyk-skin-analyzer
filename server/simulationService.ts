/**
 * Treatment Simulation Image Generation Service
 *
 * Uses OpenAI's gpt-image-1 model to generate ONE realistic "after" image
 * showing what a client would look like after ALL recommended treatments combined.
 *
 * Flow:
 * 1. Takes the client's uploaded front-facing photo
 * 2. Builds a single prompt combining ALL recommended procedures
 * 3. Generates ONE "after" simulation image via OpenAI
 * 4. Stores the generated image in S3
 * 5. Returns the URL to display in the before/after slider
 */
import { ENV } from "./_core/env";
import { storagePut } from "./storage";

interface CombinedSimulationRequest {
  /** S3 URL of the client's front-facing photo */
  sourceImageUrl: string;
  /** Client's Fitzpatrick skin type (1-6) */
  fitzpatrickType: number;
  /** All recommended procedures to combine into one simulation */
  procedures: Array<{
    name: string;
    reason: string;
    targetConditions: string[];
  }>;
  /** Analysis ID for organizing storage */
  analysisId: number;
}

/**
 * Build a combined prompt that describes the results of ALL treatments together.
 */
function buildCombinedSimulationPrompt(req: CombinedSimulationRequest): string {
  const fitzDescriptions: Record<number, string> = {
    1: "very fair/pale white skin",
    2: "fair/light white skin",
    3: "medium/light brown skin",
    4: "olive/moderate brown skin",
    5: "dark brown skin",
    6: "deeply pigmented dark brown/black skin",
  };

  const skinDesc = fitzDescriptions[req.fitzpatrickType] || "the same skin tone as in the original photo";

  // Map each procedure to SKIN-ONLY improvement descriptions (no feature changes)
  const treatmentEffects: Record<string, string> = {
    filler: "slightly smoother nasolabial fold lines, subtly plumper under-eye area",
    botox: "smoother skin on forehead area, slightly reduced crow's feet lines",
    neurotoxin: "smoother skin on forehead area, slightly reduced crow's feet lines",
    laser: "more even skin tone, slightly reduced dark spots, subtle healthy glow",
    ipl: "slightly reduced redness, more even skin tone",
    microneedling: "smoother skin texture, slightly refined pore appearance",
    "chemical peel": "brighter, more radiant skin surface, smoother texture",
    peel: "brighter, more radiant skin surface, smoother texture",
    pico: "slightly reduced pigmentation spots, more even skin tone",
    hifu: "subtly firmer-looking skin along jawline",
    "radio frequency": "subtly firmer-looking skin, slightly smoother texture",
    rf: "subtly firmer-looking skin, slightly smoother texture",
    facial: "refreshed, hydrated-looking skin with healthy glow",
    hydrafacial: "hydrated, dewy-looking skin with refined pore appearance",
    prp: "improved skin texture with natural healthy glow",
    sculptra: "subtly restored volume in hollow areas",
    "gold": "calmer, more radiant skin appearance",
    "led": "improved skin clarity, subtle glow",
  };

  // Build the combined effects description
  const effects: string[] = [];
  const allConditions: string[] = [];

  for (const proc of req.procedures) {
    const procLower = proc.name.toLowerCase();
    let effect = "";

    for (const [key, desc] of Object.entries(treatmentEffects)) {
      if (procLower.includes(key)) {
        effect = desc;
        break;
      }
    }

    if (!effect) {
      effect = `subtle skin improvement from ${proc.name}`;
    }

    effects.push(`- ${proc.name}: ${effect}`);
    allConditions.push(...proc.targetConditions);
  }

  const uniqueConditions = Array.from(new Set(allConditions));

  const effectsList = effects.join("\n");

  const conditionText = uniqueConditions.length > 0
    ? `\nTarget skin concerns to subtly improve: ${uniqueConditions.join(", ")}.`
    : "";

  return `Make ONLY subtle skin-quality improvements to this photo. This is the same person — do NOT change who they are.

Skin improvements to apply (all subtle and natural-looking):
${effectsList}
${conditionText}

#############################
# IDENTITY PRESERVATION RULES — THESE ARE ABSOLUTE AND NON-NEGOTIABLE
#############################

1. NEVER change the person's NOSE shape, size, or appearance in ANY way
2. NEVER change the person's LIP shape, size, fullness, or color
3. NEVER change the person's EYE shape, size, or color
4. NEVER change the person's EYEBROW shape or position
5. NEVER change the person's FACE SHAPE, jawline structure, or bone structure
6. NEVER change the person's SKIN COLOR or skin tone — they have ${skinDesc} and it MUST remain EXACTLY the same shade
7. NEVER lighten or darken the overall skin color
8. NEVER change the person's HAIR color, style, or length
9. NEVER change the person's CLOTHING
10. NEVER change the BACKGROUND
11. NEVER change the LIGHTING dramatically
12. NEVER add makeup or change existing makeup

WHAT YOU CAN CHANGE (and ONLY these things):
- Skin TEXTURE (smoother, more refined pores)
- Skin CLARITY (reduce visible spots, blemishes, or uneven patches)
- Skin RADIANCE (add subtle healthy glow)
- Fine LINES (slightly soften visible fine lines)
- Skin FIRMNESS appearance (very subtle)

The result should look like the EXACT SAME PERSON with slightly better skin quality — as if they had a great skincare routine for 6 months. Someone looking at both photos should immediately recognize it as the same person with no feature changes whatsoever.

Think of it as adjusting skin quality by about 15-20%, NOT transforming the person's appearance.`;
}

/**
 * Generate a single combined treatment simulation image.
 * Includes retry logic for transient failures.
 */
export async function generateTreatmentSimulations(
  analysisId: number,
  sourceImageUrl: string,
  fitzpatrickType: number,
  procedures: Array<{
    name: string;
    reason: string;
    targetConditions: string[];
  }>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  if (!ENV.openaiApiKey) {
    console.warn("[Simulation] OpenAI API key not configured, skipping simulation image");
    return results;
  }

  if (procedures.length === 0) {
    console.warn("[Simulation] No procedures provided, skipping simulation image");
    return results;
  }

  // Download the source image
  let sourceBuffer: Buffer;
  try {
    console.log(`[Simulation] Downloading source image for analysis ${analysisId}...`);
    const sourceResp = await fetch(sourceImageUrl);
    if (!sourceResp.ok) {
      throw new Error(`Failed to download source image: ${sourceResp.status}`);
    }
    sourceBuffer = Buffer.from(await sourceResp.arrayBuffer());
    console.log(`[Simulation] Source image downloaded (${(sourceBuffer.length / 1024).toFixed(0)}KB)`);
  } catch (err: any) {
    console.error(`[Simulation] Cannot download source image: ${err?.message}`);
    return results;
  }

  const prompt = buildCombinedSimulationPrompt({
    sourceImageUrl,
    fitzpatrickType,
    procedures,
    analysisId,
  });

  const procedureNames = procedures.map((p) => p.name).join(", ");
  console.log(`[Simulation] Generating COMBINED simulation for analysis ${analysisId} (${procedures.length} procedures: ${procedureNames})`);

  const maxRetries = 2;
  let lastError = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[Simulation] Retry ${attempt}/${maxRetries} for combined simulation`);
        await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
      }

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
      const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.openaiApiKey}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 && attempt < maxRetries) {
          console.warn(`[Simulation] Rate limited, will retry...`);
          lastError = "Rate limited (429)";
          continue;
        }
        throw new Error(`OpenAI API error (${response.status}): ${errorText.substring(0, 300)}`);
      }

      const result = await response.json();
      const b64Data = result.data?.[0]?.b64_json;

      if (!b64Data) {
        throw new Error("No image data returned from OpenAI");
      }

      // Convert base64 to buffer and upload to S3
      const imageBuffer = Buffer.from(b64Data, "base64");
      const storageKey = `simulations/${analysisId}/combined-treatment-${Date.now()}.png`;

      const { url } = await storagePut(storageKey, imageBuffer, "image/png");

      console.log(`[Simulation] Successfully generated combined simulation → ${storageKey}`);

      // Store under the key "__combined__" to indicate it's a single combined image
      results.set("__combined__", url);
      return results;

    } catch (error: any) {
      lastError = error?.message || "Unknown error";
      if (error?.name === "AbortError") {
        lastError = "Request timed out after 120s";
      }
      if (attempt < maxRetries) {
        console.warn(`[Simulation] Attempt ${attempt + 1} failed: ${lastError}`);
        continue;
      }
    }
  }

  console.error(`[Simulation] Failed to generate combined simulation after ${maxRetries + 1} attempts: ${lastError}`);
  return results;
}
