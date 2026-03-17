import { describe, expect, it } from "vitest";
import { SKIN_ANALYSIS_SYSTEM_PROMPT, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import { appRouter } from "./routers";

describe("Skin Analysis Prompt", () => {
  it("system prompt includes critical diagnostic rules", () => {
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("world-class AI dermatology");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("EXACTLY 2 facial treatments");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("EXACTLY 4 high-impact skin procedures");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("3 to 5 skincare products");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("Fitzpatrick");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("IPL treatments are contraindicated for Fitzpatrick types V and VI");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("acne scarring");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("NEVER give generic scores");
  });

  it("system prompt avoids generic spa language", () => {
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("Never use generic spa language");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("not a spa receptionist");
  });

  it("system prompt includes predictive/futuristic insights requirement", () => {
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("predictive aging analysis");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("skin trajectory modeling");
    expect(SKIN_ANALYSIS_SYSTEM_PROMPT).toContain("cellular-level explanations");
  });
});

describe("Skin Analysis Output Schema", () => {
  it("has the correct schema name", () => {
    expect(SKIN_ANALYSIS_OUTPUT_SCHEMA.name).toBe("skin_analysis_report");
  });

  it("schema has all 8 report sections", () => {
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, unknown>;
    // Section 1: Score
    expect(props).toHaveProperty("skinHealthScore");
    expect(props).toHaveProperty("scoreJustification");
    expect(props).toHaveProperty("skinType");
    expect(props).toHaveProperty("skinTone");
    expect(props).toHaveProperty("fitzpatrickType");

    // Section 2: Advanced Analysis
    expect(props).toHaveProperty("conditions");
    expect(props).toHaveProperty("positiveFindings");

    // Section 3: Missed Conditions
    expect(props).toHaveProperty("missedConditions");

    // Section 4: Facials
    expect(props).toHaveProperty("facialTreatments");

    // Section 5: Procedures
    expect(props).toHaveProperty("skinProcedures");

    // Section 6: Products
    expect(props).toHaveProperty("skincareProducts");

    // Section 7: Insights
    expect(props).toHaveProperty("predictiveInsights");
    expect(props).toHaveProperty("skinTrajectory");
    expect(props).toHaveProperty("cellularAnalysis");

    // Section 8: Roadmap
    expect(props).toHaveProperty("roadmap");

    // Meta
    expect(props).toHaveProperty("summary");
    expect(props).toHaveProperty("disclaimer");
  });

  it("conditions schema includes severity enum", () => {
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const conditionItems = props.conditions.items;
    const severityProp = conditionItems.properties.severity;
    expect(severityProp.enum).toEqual(["mild", "moderate", "severe"]);
  });

  it("conditions require cellularInsight field", () => {
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const conditionItems = props.conditions.items;
    expect(conditionItems.required).toContain("cellularInsight");
  });

  it("roadmap items have required phase structure", () => {
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const roadmapItems = props.roadmap.items;
    expect(roadmapItems.required).toContain("phase");
    expect(roadmapItems.required).toContain("title");
    expect(roadmapItems.required).toContain("duration");
    expect(roadmapItems.required).toContain("goals");
    expect(roadmapItems.required).toContain("treatments");
    expect(roadmapItems.required).toContain("expectedOutcome");
  });
});

describe("Skin Router Registration", () => {
  it("skin router is registered on appRouter", () => {
    // Verify the router has the skin namespace
    const routerDef = appRouter._def;
    expect(routerDef).toBeDefined();
    // The router should have procedures accessible
    const procedures = (routerDef as any).procedures;
    if (procedures) {
      expect(procedures).toHaveProperty("skin.analyze");
      expect(procedures).toHaveProperty("skin.getReport");
      expect(procedures).toHaveProperty("skin.listAnalyses");
    } else {
      // Alternative check - router record
      const record = (routerDef as any).record;
      expect(record).toHaveProperty("skin");
    }
  });
});
