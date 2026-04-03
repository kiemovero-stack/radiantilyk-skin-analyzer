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

  // Treatment-specific prompts — designed for SUBTLE, BELIEVABLE, HUMAN-LIKE results.
  // Each prompt emphasizes minimal changes that look like a real person who got a real treatment,
  // NOT a digitally enhanced or airbrushed version.
  const treatmentPrompts: Record<string, string> = {
    filler: `Make very slight, barely noticeable volume improvements: soften nasolabial folds by about 30%, add just a hint of cheek fullness, and very slightly smooth marionette lines. The person should look like they got a conservative, natural filler treatment — like they slept really well and are slightly more hydrated. Do NOT make lips bigger unless they have very thin lips. Keep all skin texture, pores, and natural imperfections. Same ${skinDesc}, same exact face shape, same lighting, same expression.`,
    botox: `Very slightly relax the forehead lines and crow's feet — reduce them by about 30-40%, NOT eliminate them. Some natural expression lines MUST remain so the face still looks alive and expressive. The skin between the brows should look slightly smoother. Do NOT make the skin look airbrushed or poreless. Keep all natural skin texture, pores, and minor imperfections. Same ${skinDesc}, same person, same lighting.`,
    neurotoxin: `Very slightly relax the forehead lines and crow's feet — reduce them by about 30-40%, NOT eliminate them. Some natural expression lines MUST remain so the face still looks alive and expressive. The skin between the brows should look slightly smoother. Do NOT make the skin look airbrushed or poreless. Keep all natural skin texture, pores, and minor imperfections. Same ${skinDesc}, same person, same lighting.`,
    laser: `Very slightly even out the skin tone — reduce the most visible dark spots and redness patches by about 40%. The skin should look a touch more even but still have natural variation in tone. Do NOT make the skin look flawless or porcelain. Keep all pores, fine lines, and natural texture. Same ${skinDesc}, same person, same features, same lighting. This should look like 4-6 weeks after one laser session.`,
    ipl: `Slightly reduce visible redness, broken capillaries, and the most prominent sun spots — by about 30-40%. The skin should look a bit more even-toned but still completely natural with normal skin variation. Do NOT remove all spots or make skin look filtered. Keep all pores, texture, and natural imperfections. Same ${skinDesc}, same person, same lighting. This should look like results after one IPL session.`,
    microneedling: `Very slightly improve skin texture — make pores look about 20% smaller and fine lines about 25% softer. The skin should have a slightly healthier, more refined appearance but still look completely real with visible pores and natural texture. Do NOT make skin look airbrushed or filtered. Same ${skinDesc}, same person, same lighting. This should look like 4 weeks after one microneedling session.`,
    "chemical peel": `Make the skin look slightly brighter and more refreshed — like the person just had a really good facial. Reduce dullness slightly, make the complexion look a tiny bit more even. Do NOT make dramatic changes. Keep all natural skin texture, pores, and imperfections. Same ${skinDesc}, same person, same lighting.`,
    peel: `Make the skin look slightly brighter and more refreshed — like the person just had a really good facial. Reduce dullness slightly, make the complexion look a tiny bit more even. Do NOT make dramatic changes. Keep all natural skin texture, pores, and imperfections. Same ${skinDesc}, same person, same lighting.`,
    pico: `Reduce the most visible pigmentation spots and sun damage by about 40%. The skin tone should look slightly more even while still having natural variation. Do NOT make skin look flawless. Keep all pores, texture, and natural imperfections. Same ${skinDesc}, same person, same lighting.`,
    hifu: `Very subtly tighten the jawline and midface — the difference should be barely noticeable, like the person looks slightly more defined. About 10-15% improvement in skin firmness. Do NOT change the face shape. Keep all natural skin texture, wrinkles, and imperfections. Same ${skinDesc}, same person, same lighting.`,
    "radio frequency": `Very subtly firm the skin along the jawline and cheeks — about 10-15% tighter appearance. The difference should be barely noticeable. Do NOT change face shape or remove wrinkles. Keep all natural texture and imperfections. Same ${skinDesc}, same person, same lighting.`,
    rf: `Very subtly firm the skin along the jawline and cheeks — about 10-15% tighter appearance with slightly smoother texture. The difference should be barely noticeable. Do NOT change face shape or remove wrinkles. Keep all natural texture and imperfections. Same ${skinDesc}, same person, same lighting.`,
    facial: `Make the skin look slightly more hydrated and refreshed — like the person drank a lot of water and got great sleep. A very subtle healthy glow, slightly less puffiness. Do NOT change skin texture or remove any imperfections. Same ${skinDesc}, same person, same lighting.`,
    hydrafacial: `Make the skin look slightly more hydrated with a very subtle dewy quality. Pores should look very slightly minimized (about 15%). The skin should look like the person just had a great facial — refreshed but completely natural. Same ${skinDesc}, same person, same lighting.`,
    prp: `Show a very subtle improvement in skin quality — slightly healthier glow, marginally improved texture. The changes should be almost imperceptible but give an overall "healthier skin" impression. Keep all natural texture, pores, and imperfections. Same ${skinDesc}, same person, same lighting.`,
    sculptra: `Show very subtle, gradual volume restoration — slightly less hollowness in the cheeks and temples, about 15-20% improvement. The results should look like natural aging reversal over 3-4 months, NOT like filler. Keep all natural skin texture and imperfections. Same ${skinDesc}, same person, same lighting.`,
    ultherapy: `Show very subtle skin firming — about 10-15% improvement in jawline definition and midface lift. The results should look like natural rejuvenation over 2-3 months. Do NOT change face shape. Keep all natural skin texture, wrinkles, and imperfections. Same ${skinDesc}, same person, same lighting.`,
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
    specificPrompt = `Show very subtle, barely noticeable skin improvement from ${req.treatmentName} treatment: ${req.treatmentDescription}. The changes should be minimal and look completely natural — like the person looks slightly healthier, NOT like they were digitally edited. Keep the same ${skinDesc}, same person, same facial features, same lighting. Keep all natural skin texture, pores, and imperfections.`;
  }

  // Add condition-specific details
  const conditionDetails = req.targetConditions.length > 0
    ? ` Focus on slightly improving these specific concerns: ${req.targetConditions.join(", ")}.`
    : "";

  return `You are editing a real person's photo to show what they would realistically look like after a ${req.treatmentName} treatment. ${specificPrompt}${conditionDetails} CRITICAL RULES: 1) The person MUST be 100% recognizable — same identity, face shape, bone structure, hair, clothing, background, lighting, and camera angle. 2) Keep ALL natural skin texture, pores, fine lines, and minor imperfections — real skin is not poreless or airbrushed. 3) Changes should be VERY SUBTLE — a viewer should have to look closely to notice the difference. 4) The result must look like a real photograph of a real person, NOT a digitally enhanced or filtered image. 5) If in doubt, make LESS change rather than more — believability is more important than dramatic results.`;
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
