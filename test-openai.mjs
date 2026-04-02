import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load env
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
console.log("OpenAI key present:", !!apiKey);
console.log("Key prefix:", apiKey ? apiKey.substring(0, 12) + "..." : "MISSING");

if (!apiKey) {
  console.log("No API key found. Exiting.");
  process.exit(1);
}

// Test basic image generation
console.log("\nTesting OpenAI image generation...");
try {
  const resp = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: "A simple red circle on white background",
      n: 1,
      size: "1024x1024",
    }),
  });
  console.log("Generation status:", resp.status);
  const body = await resp.text();
  console.log("Response:", body.substring(0, 300));
} catch (e) {
  console.log("Generation error:", e.message);
}

// Test image edit endpoint
console.log("\nTesting OpenAI image edit endpoint...");
try {
  const formData = new FormData();
  formData.append("model", "gpt-image-1");
  formData.append("prompt", "Make the background blue");
  // Create a tiny 1x1 PNG
  const pngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    "base64"
  );
  formData.append("image[]", new Blob([pngBuffer], { type: "image/png" }), "test.png");
  formData.append("size", "1024x1024");

  const resp = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
    },
    body: formData,
  });
  console.log("Edit status:", resp.status);
  const body = await resp.text();
  console.log("Response:", body.substring(0, 300));
} catch (e) {
  console.log("Edit error:", e.message);
}

process.exit(0);
