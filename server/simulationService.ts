/**
 * Treatment Simulation Image Generation Service
 *
 * Uses OpenAI's gpt-image-1 model to generate realistic "after" images
 * showing what a client would look like after recommended treatments.
 *
 * Flow:
 * 1. Takes the client's uploaded front-facing photo
 * 2. For each recommended procedure, generates an "after" simulation IN PARALLEL
 * 3. Stores each generated image in S3 IMMEDIATELY (incremental save)
 * 4. Updates the database after EACH successful generation (not just at the end)
 * 5. Returns URLs to display in the before/after slider
 *
 * Key improvements:
 * - Parallel generation (all procedures at once) instead of sequential
 * - Incremental DB saves: each image is saved as soon as it's ready
 * - Better error handling: one failure doesn't block others
 * - Source image is downloaded once and reused for all procedures
 */
import { ENV } from "./_core/env";
import { storagePut } from "./storage";

interface SimulationRequest {
  /** S3 URL of the client's front-facing photo */
  sourceImageUrl: string;
  /** Pre-downloaded source image buffer (to avoid re-downloading for each procedure) */
  sourceBuffer: Buffer;
  /** Name of the treatment/procedure */
  treatmentName: string;
  /** Description of what the treatment does */
  treatmentDescription: string;
  /** Client's Fitzpatrick skin type (1-6) */
  fitzpatrickType: number;
  /** Target conditions this treatment addresses */
  targetConditions: string[];
  /** Analysis ID for organizing storage */
  analysisId: number;
}

interface SimulationResult {
  treatmentName: string;
  simulationImageUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Build a detailed, realistic prompt for the image edit.
 * The prompt must be specific about what to change while keeping the person recognizable.
 */
function buildSimulationPrompt(req: SimulationRequest): string {
  const fitzDescriptions: Record<number, string> = {
    1: "very fair skin that burns easily",
    2: "fair skin that sometimes burns",
    3: "medium skin that tans gradually",
    4: "olive/moderate brown skin that rarely burns",
    5: "dark brown skin that very rarely burns",
    6: "deeply pigmented dark skin",
  };

  const skinDesc = fitzDescriptions[req.fitzpatrickType] || "medium skin tone";

  // Treatment-specific prompts
  const treatmentPrompts: Record<string, string> = {
    filler: `Subtly enhance facial volume: slightly fuller cheeks, smoother nasolabial folds, and more defined jawline. The changes should look natural and subtle — like a well-rested, refreshed version. Keep the same ${skinDesc}, same facial features, same lighting. No dramatic changes.`,
    botox: `Subtly smooth forehead lines and crow's feet wrinkles. The skin should look smoother and more relaxed around the forehead and eye area, but still natural with some expression lines remaining. Keep the same ${skinDesc}, same person, same lighting.`,
    neurotoxin: `Subtly smooth forehead lines and crow's feet wrinkles. The skin should look smoother and more relaxed around the forehead and eye area, but still natural with some expression lines remaining. Keep the same ${skinDesc}, same person, same lighting.`,
    laser: `Show clearer, more even skin tone with reduced hyperpigmentation, dark spots, and redness. The skin should look more luminous and even-toned while maintaining the same ${skinDesc}. Keep the same person, same features, same lighting. Subtle improvement only.`,
    ipl: `Show clearer, more even skin tone with reduced redness, broken capillaries, and sun spots. The skin should look more even and clear while maintaining the same ${skinDesc}. Keep the same person, same lighting.`,
    microneedling: `Show smoother skin texture with visibly reduced pore size, fewer fine lines, and a more refined skin surface. The skin should appear plumper and more youthful while maintaining the same ${skinDesc}. Keep the same person, same lighting.`,
    "chemical peel": `Show brighter, more radiant skin with reduced dullness, smoother texture, and more even tone. The skin should look refreshed and glowing while maintaining the same ${skinDesc}. Keep the same person, same lighting.`,
    peel: `Show brighter, more radiant skin with reduced dullness, smoother texture, and more even tone. The skin should look refreshed and glowing while maintaining the same ${skinDesc}. Keep the same person, same lighting.`,
    pico: `Show significantly reduced pigmentation, dark spots, and sun damage. The skin tone should be more even and clear while maintaining the same ${skinDesc}. Keep the same person, same lighting.`,
    hifu: `Show subtle skin tightening and lifting effect — slightly more defined jawline, lifted cheeks, and tighter neck area. The changes should look natural, like the skin is firmer. Keep the same ${skinDesc}, same person, same lighting.`,
    "radio frequency": `Show tighter, firmer skin with improved contours around the jawline and cheeks. Subtle lifting effect. Keep the same ${skinDesc}, same person, same lighting.`,
    rf: `Show tighter, firmer skin with improved contours around the jawline and cheeks. Subtle lifting effect with smoother texture. Keep the same ${skinDesc}, same person, same lighting.`,
    facial: `Show refreshed, glowing skin with improved hydration, reduced puffiness, and a healthy radiance. The skin should look revitalized and well-nourished while maintaining the same ${skinDesc}. Keep the same person, same lighting.`,
    hydrafacial: `Show deeply hydrated, plump skin with minimized pores, improved clarity, and a dewy glow. Keep the same ${skinDesc}, same person, same lighting.`,
    prp: `Show improved skin texture and tone with a natural healthy glow. Reduced fine lines and improved skin elasticity. Keep the same ${skinDesc}, same person, same lighting.`,
    sculptra: `Show subtle volume restoration with improved facial contours and reduced hollowness. Natural-looking fullness. Keep the same ${skinDesc}, same person, same lighting.`,
  };

  // Find the best matching treatment prompt
  const treatmentLower = req.treatmentName.toLowerCase();
  let specificPrompt = "";

  for (const [key, prompt] of Object.entries(treatmentPrompts)) {
    if (treatmentLower.includes(key)) {
      specificPrompt = prompt;
      break;
    }
  }

  if (!specificPrompt) {
    // Generic treatment prompt
    specificPrompt = `Show subtle skin improvement from ${req.treatmentName} treatment: ${req.treatmentDescription}. The changes should look natural and realistic. Keep the same ${skinDesc}, same person, same facial features, same lighting. Only show the specific treatment results.`;
  }

  // Add condition-specific details
  const conditionDetails = req.targetConditions.length > 0
    ? ` Focus on improving these specific concerns: ${req.targetConditions.join(", ")}.`
    : "";

  return `Edit this photo to show realistic results of a ${req.treatmentName} treatment. ${specificPrompt}${conditionDetails} IMPORTANT: Keep the person's identity, face shape, hair, clothing, and background exactly the same. Only modify the skin/facial areas affected by the treatment. The result should look like a realistic, achievable outcome — not overly edited or artificial.`;
}

/**
 * Generate a single treatment simulation image using OpenAI's image edit API.
 * Includes retry logic for transient failures.
 */
async function generateSingleSimulation(
  req: SimulationRequest
): Promise<SimulationResult> {
  const apiKey = ENV.openaiApiKey;
  if (!apiKey) {
    return {
      treatmentName: req.treatmentName,
      simulationImageUrl: "",
      success: false,
      error: "OpenAI API key not configured",
    };
  }

  const maxRetries = 2;
  let lastError = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[Simulation] Retry ${attempt}/${maxRetries} for ${req.treatmentName}`);
        // Exponential backoff: 3s, 6s
        await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
      }

      const prompt = buildSimulationPrompt(req);
      console.log(
        `[Simulation] Generating ${req.treatmentName} simulation for analysis ${req.analysisId} (attempt ${attempt + 1})`
      );

      // Use the pre-downloaded source buffer
      const formData = new FormData();
      formData.append("model", "gpt-image-1");
      formData.append("prompt", prompt);
      formData.append(
        "image[]",
        new Blob([new Uint8Array(req.sourceBuffer)], { type: "image/png" }),
        "source.png"
      );
      formData.append("size", "1024x1024");
      formData.append("quality", "high");
      formData.append("input_fidelity", "high");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // 2 minute timeout per image

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
        // If rate limited, retry
        if (response.status === 429 && attempt < maxRetries) {
          console.warn(`[Simulation] Rate limited for ${req.treatmentName}, will retry...`);
          lastError = `Rate limited (429)`;
          continue;
        }
        throw new Error(
          `OpenAI API error (${response.status}): ${errorText.substring(0, 300)}`
        );
      }

      const result = await response.json();
      const b64Data = result.data?.[0]?.b64_json;

      if (!b64Data) {
        throw new Error("No image data returned from OpenAI");
      }

      // Convert base64 to buffer and upload to S3
      const imageBuffer = Buffer.from(b64Data, "base64");
      const storageKey = `simulations/${req.analysisId}/${req.treatmentName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.png`;

      const { url } = await storagePut(storageKey, imageBuffer, "image/png");

      console.log(
        `[Simulation] Successfully generated ${req.treatmentName} simulation → ${storageKey}`
      );

      return {
        treatmentName: req.treatmentName,
        simulationImageUrl: url,
        success: true,
      };
    } catch (error: any) {
      lastError = error?.message || "Unknown error";
      if (error?.name === "AbortError") {
        lastError = "Request timed out after 120s";
      }
      if (attempt < maxRetries) {
        console.warn(`[Simulation] Attempt ${attempt + 1} failed for ${req.treatmentName}: ${lastError}`);
        continue;
      }
    }
  }

  console.error(
    `[Simulation] Failed to generate ${req.treatmentName} after ${maxRetries + 1} attempts: ${lastError}`
  );
  return {
    treatmentName: req.treatmentName,
    simulationImageUrl: "",
    success: false,
    error: lastError,
  };
}

/**
 * Generate simulation images for all recommended procedures.
 * Runs simulations IN PARALLEL for speed, with incremental DB saves.
 *
 * @returns Map of treatment name → simulation image URL
 */
export async function generateTreatmentSimulations(
  analysisId: number,
  sourceImageUrl: string,
  fitzpatrickType: number,
  procedures: Array<{
    name: string;
    reason: string;
    targetConditions: string[];
  }>,
  /** Optional callback to save each image incrementally to DB */
  onImageReady?: (treatmentName: string, imageUrl: string) => Promise<void>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  if (!ENV.openaiApiKey) {
    console.warn("[Simulation] OpenAI API key not configured, skipping simulation images");
    return results;
  }

  // Download the source image ONCE and reuse for all procedures
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

  // Generate simulations for up to 4 procedures IN PARALLEL
  const toSimulate = procedures.slice(0, 4);
  console.log(`[Simulation] Starting PARALLEL generation of ${toSimulate.length} simulations for analysis ${analysisId}`);

  const promises = toSimulate.map(async (proc) => {
    const result = await generateSingleSimulation({
      sourceImageUrl,
      sourceBuffer,
      treatmentName: proc.name,
      treatmentDescription: proc.reason,
      fitzpatrickType,
      targetConditions: proc.targetConditions,
      analysisId,
    });

    if (result.success && result.simulationImageUrl) {
      results.set(result.treatmentName, result.simulationImageUrl);

      // Incremental save: notify caller immediately when each image is ready
      if (onImageReady) {
        try {
          await onImageReady(result.treatmentName, result.simulationImageUrl);
        } catch (saveErr: any) {
          console.error(`[Simulation] Incremental save failed for ${result.treatmentName}: ${saveErr?.message}`);
        }
      }
    }

    return result;
  });

  const allResults = await Promise.allSettled(promises);

  const succeeded = allResults.filter(
    (r) => r.status === "fulfilled" && r.value.success
  ).length;
  const failed = allResults.length - succeeded;

  console.log(
    `[Simulation] Completed: ${succeeded}/${toSimulate.length} succeeded, ${failed} failed for analysis ${analysisId}`
  );

  return results;
}
