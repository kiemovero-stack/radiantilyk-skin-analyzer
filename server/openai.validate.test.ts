import { describe, expect, it } from "vitest";

describe("OpenAI API Key Validation", () => {
  it("can authenticate with OpenAI API using OPENAI_API_KEY", async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey!.startsWith("sk-")).toBe(true);

    // Lightweight validation: list models endpoint
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);

    // Check that image models are available
    const modelIds = data.data.map((m: any) => m.id);
    const hasImageModel = modelIds.some(
      (id: string) => id.includes("gpt-image") || id.includes("dall-e")
    );
    console.log(
      "Available image models:",
      modelIds.filter(
        (id: string) => id.includes("image") || id.includes("dall-e")
      )
    );
    expect(hasImageModel).toBe(true);
  });
});
