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
    1: "very fair skin that burns easily",
    2: "fair skin that sometimes burns",
    3: "medium skin that tans gradually",
    4: "olive/moderate brown skin that rarely burns",
    5: "dark brown skin that very rarely burns",
    6: "deeply pigmented dark skin",
  };

  const skinDesc = fitzDescriptions[req.fitzpatrickType] || "medium skin tone";

  // Map each procedure to a specific improvement description
  const treatmentEffects: Record<string, string> = {
    filler: "subtly fuller cheeks, smoother nasolabial folds, more defined jawline",
    botox: "smoother forehead, reduced crow's feet wrinkles",
    neurotoxin: "smoother forehead, reduced crow's feet wrinkles",
    laser: "more even skin tone, reduced dark spots and redness, luminous complexion",
    ipl: "reduced redness, fewer broken capillaries, more even skin tone",
    microneedling: "smoother skin texture, reduced pore size, fewer fine lines",
    "chemical peel": "brighter, more radiant skin, smoother texture, reduced dullness",
    peel: "brighter, more radiant skin, smoother texture",
    pico: "significantly reduced pigmentation and dark spots, more even skin tone",
    hifu: "subtle skin tightening, more defined jawline, lifted cheeks",
    "radio frequency": "tighter, firmer skin, improved jawline contours",
    rf: "tighter, firmer skin, smoother texture",
    facial: "refreshed, glowing skin, improved hydration, reduced puffiness",
    hydrafacial: "deeply hydrated, plump skin, minimized pores, dewy glow",
    prp: "improved skin texture and tone, natural healthy glow",
    sculptra: "subtle volume restoration, improved facial contours",
    "gold": "calmer, more radiant skin, reduced inflammation",
    "led": "improved skin clarity, reduced redness, enhanced cell renewal",
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
      effect = `improvement from ${proc.name} (${proc.reason})`;
    }

    effects.push(`${proc.name}: ${effect}`);
    allConditions.push(...proc.targetConditions);
  }

  const uniqueConditions = Array.from(new Set(allConditions));
  const procedureNames = req.procedures.map((p) => p.name).join(", ");

  const effectsList = effects.map((e) => `- ${e}`).join("\n");

  const conditionText = uniqueConditions.length > 0
    ? `\n\nSpecifically address these concerns: ${uniqueConditions.join(", ")}.`
    : "";

  return `Edit this photo to show the realistic COMBINED results of a complete treatment plan including: ${procedureNames}.

Show the following improvements together in one natural-looking result:
${effectsList}

The person should look like the best, most refreshed version of themselves — as if they completed a full treatment plan over several months. All changes should work together harmoniously.${conditionText}

CRITICAL RULES:
- Keep the same ${skinDesc}, same person, same face shape, same hair, same clothing, same background
- Only modify the skin and facial areas affected by the treatments
- The result must look NATURAL and ACHIEVABLE — not overly edited, filtered, or artificial
- Think "subtle but noticeable improvement" — like the person looks well-rested, healthy, and glowing
- All improvements should blend together seamlessly into one cohesive look`;
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
