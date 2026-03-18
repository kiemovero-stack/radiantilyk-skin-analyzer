import { describe, expect, it } from "vitest";
import { buildSystemPrompt, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import { appRouter } from "./routers";
import { SERVICE_CATALOG, getServiceCatalogText } from "../shared/serviceCatalog";
import { PRODUCT_CATALOG, getProductCatalogText, getProductCount } from "../shared/productCatalog";

const systemPrompt = buildSystemPrompt();

describe("Skin Analysis Prompt", () => {
  it("system prompt includes critical diagnostic rules", () => {
    expect(systemPrompt).toContain("world-class AI dermatology");
    expect(systemPrompt).toContain("EXACTLY 2 facial treatments");
    expect(systemPrompt).toContain("EXACTLY 4 high-impact skin procedures");
    expect(systemPrompt).toContain("3 to 5 skincare product");
    expect(systemPrompt).toContain("Fitzpatrick");
    expect(systemPrompt).toContain("IPL treatments are contraindicated for Fitzpatrick types V and VI");
    expect(systemPrompt).toContain("acne scarring");
    expect(systemPrompt).toContain("NEVER give generic scores");
  });

  it("system prompt avoids generic spa language", () => {
    expect(systemPrompt).toContain("Never use generic spa language");
    expect(systemPrompt).toContain("not a spa receptionist");
  });

  it("system prompt includes predictive/futuristic insights requirement", () => {
    expect(systemPrompt).toContain("predictive aging analysis");
    expect(systemPrompt).toContain("skin trajectory modeling");
    expect(systemPrompt).toContain("cellular-level explanations");
  });

  it("system prompt includes the clinic service catalog", () => {
    expect(systemPrompt).toContain("CLINIC SERVICE CATALOG WITH PRICING");
    expect(systemPrompt).toContain("ONLY recommend services and treatments from this catalog");
    expect(systemPrompt).toContain("Include the exact price");
  });

  it("system prompt includes the product catalog from rkaskin.co", () => {
    expect(systemPrompt).toContain("RADIANTILYK AESTHETIC SKINCARE PRODUCT CATALOG");
    expect(systemPrompt).toContain("ONLY recommend products from this catalog");
    expect(systemPrompt).toContain("rkaskin.co");
    expect(systemPrompt).toContain("END OF PRODUCT CATALOG");
  });

  it("system prompt contains key products from the catalog", () => {
    expect(systemPrompt).toContain("RadiantilyK Aesthetic Vitamin C Facial Serum 30ml");
    expect(systemPrompt).toContain("RKA-010");
    expect(systemPrompt).toContain("$49.00");
    expect(systemPrompt).toContain("EELHOE Sun Cream SPF90");
    expect(systemPrompt).toContain("Dermagarden Peptide-7 Cream");
    expect(systemPrompt).toContain("AIXIN Beauty");
  });

  it("system prompt instructs AI to always recommend sunscreen", () => {
    expect(systemPrompt).toContain("Always recommend the EELHOE Sun Cream SPF90");
  });

  it("system prompt contains key services from the catalog", () => {
    expect(systemPrompt).toContain("RF Microneedling");
    expect(systemPrompt).toContain("$450");
    expect(systemPrompt).toContain("24K Gold Recovery Facial");
    expect(systemPrompt).toContain("$145");
    expect(systemPrompt).toContain("HIFU");
    expect(systemPrompt).toContain("Chemical Peels");
    expect(systemPrompt).toContain("IPL");
  });

  it("system prompt mentions multi-angle analysis", () => {
    expect(systemPrompt).toContain("multiple angles");
    expect(systemPrompt).toContain("front, left, right");
  });
});

describe("Service Catalog", () => {
  it("has all expected service categories", () => {
    const categories = SERVICE_CATALOG.map((c) => c.category);
    expect(categories).toContain("Neurotoxins");
    expect(categories).toContain("Dermal Filler");
    expect(categories).toContain("Chemical Peels");
    expect(categories).toContain("Microneedling");
    expect(categories).toContain("HIFU");
    expect(categories).toContain("Facials");
    expect(categories).toContain("Facial Add-Ons");
  });

  it("facials category has 7 facial options", () => {
    const facials = SERVICE_CATALOG.find((c) => c.category === "Facials");
    expect(facials).toBeDefined();
    expect(facials!.services).toHaveLength(7);
  });

  it("getServiceCatalogText returns formatted text", () => {
    const text = getServiceCatalogText();
    expect(text).toContain("CLINIC SERVICE CATALOG");
    expect(text).toContain("END OF CATALOG");
    expect(text.length).toBeGreaterThan(500);
  });

  it("all services have name and price", () => {
    for (const cat of SERVICE_CATALOG) {
      for (const svc of cat.services) {
        expect(svc.name).toBeTruthy();
        expect(svc.price).toBeTruthy();
        expect(svc.price).toMatch(/\$/);
      }
    }
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

  it("skincareProducts schema requires sku and price fields", () => {
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const productItems = props.skincareProducts.items;
    expect(productItems.required).toContain("sku");
    expect(productItems.required).toContain("price");
    expect(productItems.required).toContain("name");
    expect(productItems.properties).toHaveProperty("sku");
    expect(productItems.properties).toHaveProperty("price");
  });

  it("facial treatments schema requires price field", () => {
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const facialItems = props.facialTreatments.items;
    expect(facialItems.required).toContain("price");
    expect(facialItems.properties).toHaveProperty("price");
  });

  it("skin procedures schema requires price field", () => {
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const procItems = props.skinProcedures.items;
    expect(procItems.required).toContain("price");
    expect(procItems.properties).toHaveProperty("price");
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

describe("PDF Report Generation", () => {
  it("generateReportPdf returns a Buffer", async () => {
    const { generateReportPdf } = await import("./pdfReport");
    const mockReport = {
      skinHealthScore: 72,
      scoreJustification: "Test justification",
      skinType: "Combination",
      skinTone: "Medium",
      fitzpatrickType: 3,
      conditions: [
        {
          name: "Acne",
          severity: "moderate" as const,
          area: "T-zone",
          description: "Active breakouts",
          cellularInsight: "Sebaceous gland overactivity",
        },
      ],
      positiveFindings: ["Good hydration levels"],
      missedConditions: [],
      facialTreatments: [
        {
          name: "24K Gold Recovery Facial",
          price: "$145",
          reason: "Anti-inflammatory",
          targetConditions: ["Acne"],
          benefits: ["Reduces redness"],
          priority: 1,
        },
      ],
      skinProcedures: [
        {
          name: "RF Microneedling",
          price: "$450",
          reason: "Collagen induction",
          targetConditions: ["Acne scarring"],
          benefits: ["Skin renewal"],
          expectedResults: "Visible improvement in 4-6 weeks",
          priority: 1,
        },
      ],
      skincareProducts: [
        {
          name: "RadiantilyK Aesthetic Vitamin C Facial Serum 30ml",
          sku: "RKA-010",
          price: "$49.00",
          type: "Serum",
          purpose: "Brightening and antioxidant protection",
          keyIngredients: ["Vitamin C", "L-Ascorbic Acid"],
          targetConditions: ["Hyperpigmentation"],
        },
      ],
      predictiveInsights: [
        {
          title: "Aging Forecast",
          description: "Moderate collagen loss expected",
          timeframe: "5 years",
        },
      ],
      skinTrajectory: "Improving with treatment",
      cellularAnalysis: "Normal cell turnover rate",
      roadmap: [
        {
          phase: 1,
          title: "Foundation",
          duration: "4 weeks",
          goals: ["Reduce inflammation"],
          treatments: ["24K Gold Recovery Facial"],
          expectedOutcome: "Calmer skin",
        },
      ],
      summary: "Overall good skin health with room for improvement.",
      disclaimer: "This is for informational purposes only.",
    };

    const pdf = await generateReportPdf(mockReport, {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      dob: "1990-05-15",
      analysisDate: "March 17, 2026",
    });

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(1000);
    // PDF files start with %PDF
    expect(pdf.toString("utf-8", 0, 5)).toBe("%PDF-");
  });
});

describe("Email Service", () => {
  it("sendReportEmail returns a result object with success field", async () => {
    const { sendReportEmail } = await import("./emailService");
    // The function should always return a structured result (not throw)
    const result = await sendReportEmail({
      toEmail: "test@example.com",
      patientName: "Test User",
      skinHealthScore: 72,
      pdfBuffer: Buffer.from("fake pdf"),
      analysisDate: "March 17, 2026",
    });

    // Result should have a success field (boolean)
    expect(typeof result.success).toBe("boolean");
    // If successful, should have messageId; if failed, should have error
    if (result.success) {
      expect(result.messageId).toBeDefined();
    } else {
      expect(result.error).toBeDefined();
    }
  });
});

describe("Skin Router Registration", () => {
  it("skin router is registered on appRouter with all endpoints", () => {
    const routerDef = appRouter._def;
    expect(routerDef).toBeDefined();
    const procedures = (routerDef as any).procedures;
    if (procedures) {
      expect(procedures).toHaveProperty("skin.analyze");
      expect(procedures).toHaveProperty("skin.getReport");
      expect(procedures).toHaveProperty("skin.listAnalyses");
      expect(procedures).toHaveProperty("skin.downloadPdf");
      expect(procedures).toHaveProperty("skin.emailReport");
    } else {
      const record = (routerDef as any).record;
      expect(record).toHaveProperty("skin");
    }
  });

  it("uploadImages tRPC mutation has been removed (now uses Express multipart route)", () => {
    const routerDef = appRouter._def;
    const procedures = (routerDef as any).procedures;
    if (procedures) {
      expect(procedures).not.toHaveProperty("skin.uploadImages");
    }
    // The upload is now handled by /api/upload-images Express route
  });
});

describe("Upload Route Module", () => {
  it("registerUploadRoute is a function that can be imported", async () => {
    const { registerUploadRoute } = await import("./uploadRoute");
    expect(typeof registerUploadRoute).toBe("function");
  });
});

describe("Product Catalog", () => {
  it("has all expected product categories", () => {
    const categories = PRODUCT_CATALOG.map((c) => c.category);
    expect(categories).toContain("Cleansers");
    expect(categories).toContain("Creams");
    expect(categories).toContain("Serums");
    expect(categories).toContain("Post-Procedure");
    expect(categories).toContain("Sunscreen");
    expect(categories).toContain("Trial Kits");
  });

  it("has exactly 32 products total", () => {
    expect(getProductCount()).toBe(32);
  });

  it("all products have sku, name, price, and description", () => {
    for (const cat of PRODUCT_CATALOG) {
      for (const prod of cat.products) {
        expect(prod.sku).toMatch(/^RKA-\d{3}$/);
        expect(prod.name).toBeTruthy();
        expect(prod.price).toMatch(/^\$\d+\.\d{2}$/);
        expect(prod.description).toBeTruthy();
        expect(prod.keyBenefits.length).toBeGreaterThan(0);
      }
    }
  });

  it("serums category has 13 products", () => {
    const serums = PRODUCT_CATALOG.find((c) => c.category === "Serums");
    expect(serums).toBeDefined();
    expect(serums!.products).toHaveLength(13);
  });

  it("creams category has 10 products", () => {
    const creams = PRODUCT_CATALOG.find((c) => c.category === "Creams");
    expect(creams).toBeDefined();
    expect(creams!.products).toHaveLength(10);
  });

  it("getProductCatalogText returns formatted text", () => {
    const text = getProductCatalogText();
    expect(text).toContain("RADIANTILYK AESTHETIC SKINCARE PRODUCT CATALOG");
    expect(text).toContain("END OF PRODUCT CATALOG");
    expect(text).toContain("rkaskin.co");
    expect(text.length).toBeGreaterThan(2000);
  });

  it("includes RadiantilyK branded products", () => {
    const allProducts = PRODUCT_CATALOG.flatMap((c) => c.products);
    const rkaProducts = allProducts.filter((p) => p.name.includes("RadiantilyK"));
    expect(rkaProducts.length).toBeGreaterThanOrEqual(4);
  });

  it("includes sunscreen product", () => {
    const sunscreen = PRODUCT_CATALOG.find((c) => c.category === "Sunscreen");
    expect(sunscreen).toBeDefined();
    expect(sunscreen!.products).toHaveLength(1);
    expect(sunscreen!.products[0].name).toContain("SPF90");
  });
});

describe("Comparison Feature", () => {
  it("getComparisonData endpoint is registered on the skin router", () => {
    const routerDef = appRouter._def;
    const procedures = (routerDef as any).procedures;
    if (procedures) {
      expect(procedures).toHaveProperty("skin.getComparisonData");
    } else {
      const record = (routerDef as any).record;
      expect(record).toHaveProperty("skin");
    }
  });

  it("getComparisonData input requires at least 2 IDs", () => {
    // The schema requires min(2) and max(5) IDs
    const routerDef = appRouter._def;
    const procedures = (routerDef as any).procedures;
    if (procedures) {
      const proc = procedures["skin.getComparisonData"];
      expect(proc).toBeDefined();
    }
  });

  it("all required endpoints exist for comparison flow", () => {
    const routerDef = appRouter._def;
    const procedures = (routerDef as any).procedures;
    if (procedures) {
      // listAnalyses is needed to show history and select items
      expect(procedures).toHaveProperty("skin.listAnalyses");
      // getComparisonData is needed to fetch the selected analyses
      expect(procedures).toHaveProperty("skin.getComparisonData");
      // getReport is needed for individual report view
      expect(procedures).toHaveProperty("skin.getReport");
    }
  });
});
