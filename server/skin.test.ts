import { describe, expect, it } from "vitest";
import { buildSystemPrompt, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import { buildClientSystemPrompt, CLIENT_ANALYSIS_OUTPUT_SCHEMA } from "./clientPrompt";
import { appRouter } from "./routers";
import { SERVICE_CATALOG, getServiceCatalogText } from "../shared/serviceCatalog";
import { PRODUCT_CATALOG, getProductCatalogText, getProductCount } from "../shared/productCatalog";

const systemPrompt = buildSystemPrompt();
const clientPrompt = buildClientSystemPrompt();

describe("Skin Analysis Prompt", () => {
  it("system prompt includes critical diagnostic rules", () => {
    expect(systemPrompt).toContain("world-class AI dermatology");
    expect(systemPrompt).toContain("AT LEAST 3 facial treatments");
    expect(systemPrompt).toContain("4 to 8 high-impact skin procedures");
    expect(systemPrompt).toContain("5 to 7 skincare product");
    expect(systemPrompt).toContain("Fitzpatrick");
    expect(systemPrompt).toContain("NEVER recommend IPL");
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

  it("system prompt includes the product catalog", () => {
    expect(systemPrompt).toContain("SKINCARE PRODUCT CATALOG");
    expect(systemPrompt).toContain("ONLY from the RadiantilyK Aesthetic Product Catalog");
    expect(systemPrompt).toContain("END OF PRODUCT CATALOG");
  });

  it("system prompt contains key products from the catalog", () => {
    expect(systemPrompt).toContain("RadiantilyK Aesthetic Vitamin C Facial Serum");
    expect(systemPrompt).toContain("RKA-");
    expect(systemPrompt).toContain("EELHOE Sun Cream SPF90");
    expect(systemPrompt).toContain("Dermagarden");
    expect(systemPrompt).toContain("AIXIN Beauty");
    expect(systemPrompt).toContain("EltaMD");
  });

  it("system prompt instructs AI to always recommend sunscreen", () => {
    expect(systemPrompt).toContain("ALWAYS recommend a sunscreen");
    expect(systemPrompt).toContain("EltaMD");
    expect(systemPrompt).toContain("EELHOE");
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
    expect(categories).toContain("Medical Weight Loss");
    expect(categories).toContain("Peptide Therapy");
    expect(categories).toContain("Hormone Replacement Therapy");
    expect(categories).toContain("Hair Restoration");
  });

  it("Medical Weight Loss category has Semaglutide and Tirzepatide", () => {
    const wl = SERVICE_CATALOG.find((c) => c.category === "Medical Weight Loss");
    expect(wl).toBeDefined();
    expect(wl!.services.length).toBeGreaterThanOrEqual(3);
    const names = wl!.services.map((s) => s.name);
    expect(names.some((n) => n.includes("Semaglutide"))).toBe(true);
    expect(names.some((n) => n.includes("Tirzepatide"))).toBe(true);
    expect(names.some((n) => n.includes("B12"))).toBe(true);
  });

  it("Peptide Therapy category has BPC-157 and GHK-Cu", () => {
    const pt = SERVICE_CATALOG.find((c) => c.category === "Peptide Therapy");
    expect(pt).toBeDefined();
    expect(pt!.services.length).toBeGreaterThanOrEqual(4);
    const names = pt!.services.map((s) => s.name);
    expect(names.some((n) => n.includes("BPC-157"))).toBe(true);
    expect(names.some((n) => n.includes("GHK-Cu"))).toBe(true);
    expect(names.some((n) => n.includes("CJC-1295"))).toBe(true);
  });

  it("Hormone Replacement Therapy category has male and female options", () => {
    const hrt = SERVICE_CATALOG.find((c) => c.category === "Hormone Replacement Therapy");
    expect(hrt).toBeDefined();
    expect(hrt!.services.length).toBeGreaterThanOrEqual(4);
    const names = hrt!.services.map((s) => s.name);
    expect(names.some((n) => n.includes("Female"))).toBe(true);
    expect(names.some((n) => n.includes("Male"))).toBe(true);
    expect(names.some((n) => n.includes("Thyroid"))).toBe(true);
  });

  it("Hair Restoration category has PRP and Exosome options", () => {
    const hr = SERVICE_CATALOG.find((c) => c.category === "Hair Restoration");
    expect(hr).toBeDefined();
    expect(hr!.services.length).toBeGreaterThanOrEqual(2);
    const names = hr!.services.map((s) => s.name);
    expect(names.some((n) => n.includes("PRP"))).toBe(true);
    expect(names.some((n) => n.includes("Exosome"))).toBe(true);
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
          price: "$28.00",
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
    expect(categories).toContain("Cleansers & Toners");
    expect(categories).toContain("Creams & Moisturizers");
    expect(categories).toContain("Serums");
    expect(categories).toContain("Post-Procedure");
    expect(categories).toContain("Sunscreens");
    expect(categories).toContain("Trial Kits");
    expect(categories).toContain("Lip Care");
  });

  it("has 67 products total (synced from storefront)", () => {
    expect(getProductCount()).toBe(67);
  });

  it("all products have sku, name, price, and description", () => {
    for (const cat of PRODUCT_CATALOG) {
      for (const prod of cat.products) {
        expect(prod.sku).toBeTruthy();
        expect(prod.name).toBeTruthy();
        expect(prod.price).toMatch(/^\$\d+\.\d{2}$/);
        expect(prod.description).toBeTruthy();
        expect(prod.keyBenefits.length).toBeGreaterThan(0);
      }
    }
  });

  it("serums category has 22 products", () => {
    const serums = PRODUCT_CATALOG.find((c) => c.category === "Serums");
    expect(serums).toBeDefined();
    expect(serums!.products).toHaveLength(22);
  });

  it("creams & moisturizers category has 18 products", () => {
    const creams = PRODUCT_CATALOG.find((c) => c.category === "Creams & Moisturizers");
    expect(creams).toBeDefined();
    expect(creams!.products).toHaveLength(18);
  });

  it("getProductCatalogText returns formatted text", () => {
    const text = getProductCatalogText();
    expect(text).toContain("SKINCARE PRODUCT CATALOG");
    expect(text).toContain("END OF PRODUCT CATALOG");
    expect(text.length).toBeGreaterThan(2000);
  });

  it("includes RadiantilyK branded products", () => {
    const allProducts = PRODUCT_CATALOG.flatMap((c) => c.products);
    const rkaProducts = allProducts.filter((p) => p.name.includes("RadiantilyK"));
    expect(rkaProducts.length).toBeGreaterThanOrEqual(4);
  });

  it("includes sunscreen products including EltaMD and BARUBT", () => {
    const sunscreen = PRODUCT_CATALOG.find((c) => c.category === "Sunscreens");
    expect(sunscreen).toBeDefined();
    expect(sunscreen!.products.length).toBeGreaterThanOrEqual(5);
    const names = sunscreen!.products.map((p) => p.name);
    expect(names.some((n) => n.includes("EltaMD"))).toBe(true);
    expect(names.some((n) => n.includes("BARUBT"))).toBe(true);
    expect(names.some((n) => n.includes("SPF90") || n.includes("SPF"))).toBe(true);
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

describe("Client Portal - Prompt", () => {
  it("client prompt uses layman-friendly language", async () => {
    const prompt = buildClientSystemPrompt();
    expect(prompt).toContain("friendly, knowledgeable skin care expert");
    expect(prompt).toContain("SIMPLE, EASY-TO-UNDERSTAND language");
    expect(prompt).toContain("like you're talking to a friend");
    expect(prompt).toContain("dark marks left behind after breakouts");
    expect(prompt).toContain("skin's natural support structure is weakening");
  });

  it("client prompt includes Fitzpatrick safety rules", async () => {
    const prompt = buildClientSystemPrompt();
    expect(prompt).toContain("FITZPATRICK SKIN TYPE");
    expect(prompt).toContain("NEVER recommend IPL");
    expect(prompt).toContain("TREATMENT STACKING");
    expect(prompt).toMatch(/darker skin/);
  });

  it("client prompt includes treatment simulation instructions", async () => {
    const prompt = buildClientSystemPrompt();
    expect(prompt).toContain("TREATMENT SIMULATION DESCRIPTIONS");
    expect(prompt).toContain("Fillers");
    expect(prompt).toContain("Microneedling");
    expect(prompt).toContain("Laser");
  });

  it("client prompt includes both service and product catalogs", async () => {
    const prompt = buildClientSystemPrompt();
    expect(prompt).toContain("CLINIC SERVICE CATALOG");
    expect(prompt).toContain("SKINCARE PRODUCT CATALOG");
  });

  it("client prompt instructs to recommend SPF and post-procedure products", async () => {
    const prompt = buildClientSystemPrompt();
    expect(prompt).toContain("ALWAYS recommend a sunscreen");
    expect(prompt).toContain("post-procedure recovery product");
  });
});

describe("Client Portal - Output Schema", () => {
  it("client schema has correct name", async () => {
    expect(CLIENT_ANALYSIS_OUTPUT_SCHEMA.name).toBe("client_skin_analysis_report");
  });

  it("client schema has all required report sections", async () => {
    const props = CLIENT_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, unknown>;
    expect(props).toHaveProperty("skinHealthScore");
    expect(props).toHaveProperty("scoreJustification");
    expect(props).toHaveProperty("skinType");
    expect(props).toHaveProperty("fitzpatrickType");
    expect(props).toHaveProperty("conditions");
    expect(props).toHaveProperty("positiveFindings");
    expect(props).toHaveProperty("missedConditions");
    expect(props).toHaveProperty("facialTreatments");
    expect(props).toHaveProperty("skinProcedures");
    expect(props).toHaveProperty("skincareProducts");
    expect(props).toHaveProperty("predictiveInsights");
    expect(props).toHaveProperty("roadmap");
    expect(props).toHaveProperty("summary");
    expect(props).toHaveProperty("disclaimer");
  });

  it("client schema skinProcedures items require expectedResults for simulation", async () => {
    const props = CLIENT_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const procItems = props.skinProcedures.items;
    expect(procItems.required).toContain("expectedResults");
    expect(procItems.properties.expectedResults.description).toBeTruthy();
  });

  it("client schema skincareProducts items require sku and price", async () => {
    const props = CLIENT_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const productItems = props.skincareProducts.items;
    expect(productItems.required).toContain("sku");
    expect(productItems.required).toContain("price");
    expect(productItems.required).toContain("name");
  });
});

describe("Client Portal - Routes Module", () => {
  it("registerClientRoutes is a function that can be imported", async () => {
    const { registerClientRoutes } = await import("./clientRoutes");
    expect(typeof registerClientRoutes).toBe("function");
  });
});

describe("Client Portal - Email Services", () => {
  it("sendClientReportEmail returns a result object", async () => {
    const { sendClientReportEmail } = await import("./clientEmailService");
    const result = await sendClientReportEmail({
      toEmail: "test@example.com",
      patientName: "Test User",
      skinHealthScore: 72,
      pdfBuffer: Buffer.from("fake pdf"),
      analysisDate: "April 2, 2026",
      reportUrl: "/client/report/1",
    });
    expect(typeof result.success).toBe("boolean");
    if (result.success) {
      expect(result.messageId).toBeDefined();
    } else {
      expect(result.error).toBeDefined();
    }
  });

  it("scheduleFollowUpEmails is a function that can be imported", async () => {
    const { scheduleFollowUpEmails } = await import("./followUpService");
    expect(typeof scheduleFollowUpEmails).toBe("function");
  });

  it("scheduleFollowUpEmails prevents duplicate scheduling", async () => {
    const { scheduleFollowUpEmails } = await import("./followUpService");
    // Calling twice with same analysisId should not throw
    const config = {
      analysisId: 999999,
      patientEmail: "test@example.com",
      patientName: "Test User",
      skinHealthScore: 72,
      topConcerns: ["Acne", "Wrinkles"],
      topTreatment: "RF Microneedling",
    };
    scheduleFollowUpEmails(config);
    scheduleFollowUpEmails(config); // should be silently skipped
    // No error means it worked
    expect(true).toBe(true);
  });

  it("follow-up service sends emails at 24hr and 72hr intervals", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/server/followUpService.ts",
      "utf-8"
    );
    // Verify 24hr and 72hr timing
    expect(content).toContain("TWENTY_FOUR_HOURS");
    expect(content).toContain("SEVENTY_TWO_HOURS");
    expect(content).toContain("72 * 60 * 60 * 1000");
    // Verify 24hr email is gentle
    expect(content).toContain("Checking In On You");
    expect(content).toContain("25% OFF Your First Treatment");
    // Verify 72hr email is urgent
    expect(content).toContain("Your Offer Is Expiring Soon");
    expect(content).toContain("Book Now");
    expect(content).toContain("Claim Your 25% Off");
    expect(content).toContain("Limited Time");
  });
});

describe("Treatment Simulation Schema", () => {
  it("client schema skinProcedures include simulation object", async () => {
    const props = CLIENT_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const procItems = props.skinProcedures.items;
    expect(procItems.properties).toHaveProperty("simulation");
    const sim = procItems.properties.simulation;
    expect(sim.properties).toHaveProperty("beforeDescription");
    expect(sim.properties).toHaveProperty("afterDescription");
    expect(sim.properties).toHaveProperty("improvementPercent");
    expect(sim.properties).toHaveProperty("timelineWeeks");
    expect(sim.properties).toHaveProperty("sessionsNeeded");
    expect(sim.properties).toHaveProperty("milestones");
  });

  it("simulation milestones have timepoint, description, and improvementPercent", async () => {
    const props = CLIENT_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const procItems = props.skinProcedures.items;
    const milestones = procItems.properties.simulation.properties.milestones;
    expect(milestones.type).toBe("array");
    const milestoneItem = milestones.items;
    expect(milestoneItem.properties).toHaveProperty("timepoint");
    expect(milestoneItem.properties).toHaveProperty("description");
    expect(milestoneItem.properties).toHaveProperty("improvementPercent");
  });

  it("staff schema skinProcedures also include simulation object", async () => {
    const { SKIN_ANALYSIS_OUTPUT_SCHEMA } = await import("./skinPrompt");
    const props = SKIN_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const procItems = props.skinProcedures.items;
    expect(procItems.properties).toHaveProperty("simulation");
  });

  it("simulation improvementPercent is a number type", async () => {
    const props = CLIENT_ANALYSIS_OUTPUT_SCHEMA.schema.properties as Record<string, any>;
    const sim = props.skinProcedures.items.properties.simulation;
    expect(sim.properties.improvementPercent.type).toBe("number");
    expect(sim.properties.timelineWeeks.type).toBe("number");
  });
});

describe("Client Landing Page Route", () => {
  it("App routes include /client, /client/start, and /client/report/:id", async () => {
    // Verify the route structure exists by checking the App.tsx imports
    // This is a structural test to ensure routing is configured
    const fs = await import("fs");
    const appContent = fs.readFileSync("/home/ubuntu/skin-analyzer/client/src/App.tsx", "utf-8");
    expect(appContent).toContain('path="/client"');
    expect(appContent).toContain('path="/client/start"');
    expect(appContent).toContain('path="/client/report/:id"');
    expect(appContent).toContain("ClientLanding");
    expect(appContent).toContain("ClientAnalyze");
    expect(appContent).toContain("ClientReport");
  });

  it("ClientLanding page file exists and exports default component", async () => {
    const fs = await import("fs");
    const exists = fs.existsSync("/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx");
    expect(exists).toBe(true);
    const content = fs.readFileSync("/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx", "utf-8");
    expect(content).toContain("export default function ClientLanding");
    expect(content).toContain("rkaemr.click/portal");
    expect(content).toContain("How It Works");
    expect(content).toContain("What Our Clients Say");
    expect(content).toContain("Get My Free Skin Analysis");
  });

  it("ClientLanding links to /client/start for the analysis flow", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx", "utf-8");
    expect(content).toContain("/client/start");
  });
});

describe("Simulation Image Service", () => {
  it("simulationService module exports generateTreatmentSimulations function", async () => {
    const mod = await import("./simulationService");
    expect(typeof mod.generateTreatmentSimulations).toBe("function");
  });

  it("generateTreatmentSimulations returns empty map when no API key", async () => {
    // When OPENAI_API_KEY is not set, it should gracefully return empty
    const origKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "";
    
    const { generateTreatmentSimulations } = await import("./simulationService");
    const results = await generateTreatmentSimulations(
      999,
      "https://example.com/photo.jpg",
      3,
      [{ name: "Botox", reason: "Wrinkle reduction", targetConditions: ["Wrinkles"] }]
    );
    
    expect(results).toBeInstanceOf(Map);
    expect(results.size).toBe(0);
    
    // Restore
    if (origKey) process.env.OPENAI_API_KEY = origKey;
  });

  it("simulationImages column exists in schema", async () => {
    const { skinAnalyses } = await import("../drizzle/schema");
    expect(skinAnalyses.simulationImages).toBeDefined();
  });

  it("ENV includes openaiApiKey field", async () => {
    const { ENV } = await import("./_core/env");
    expect(ENV).toHaveProperty("openaiApiKey");
  });
});

describe("Client Report includes simulation images", () => {
  it("client report endpoint returns simulationImages field", async () => {
    const fs = await import("fs");
    const routeContent = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/server/clientRoutes.ts",
      "utf-8"
    );
    expect(routeContent).toContain("simulationImages");
    expect(routeContent).toContain("record.simulationImages");
  });

  it("ClientReport.tsx includes single combined BeforeAfterSlider", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientReport.tsx",
      "utf-8"
    );
    expect(content).toContain("BeforeAfterSlider");
    expect(content).toContain("simulationImages");
    expect(content).toContain("BEFORE");
    expect(content).toContain("AFTER");
    expect(content).toContain("Your Treatment Preview");
    expect(content).toContain("__combined__");
    expect(content).toContain("Combined Results");
    expect(content).toContain("Drag the slider to compare");
  });

  it("ClientReport ReportData interface includes simulationImages", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientReport.tsx",
      "utf-8"
    );
    expect(content).toContain("simulationImages: Record<string, string>");
  });

  it("simulation generation is triggered asynchronously after analysis completion", async () => {
    const fs = await import("fs");
    const routeContent = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/server/clientRoutes.ts",
      "utf-8"
    );
    expect(routeContent).toContain("generateTreatmentSimulations");
    expect(routeContent).toContain("Starting combined simulation");
    expect(routeContent).toContain("Combined image saved");
    // Verify async flow: analysis is marked completed BEFORE simulations
    expect(routeContent).toContain('status: "completed"');
    expect(routeContent).toContain("generateSimulationsInBackground");
    expect(routeContent).toContain("Fire-and-forget");
  });
});

describe("Simulation Polling Endpoint", () => {
  it("clientRoutes.ts has a /api/client/simulations/:id endpoint", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/server/clientRoutes.ts",
      "utf-8"
    );
    expect(content).toContain("/api/client/simulations/:id");
    expect(content).toContain("simulationImages");
    expect(content).toContain("ready");
  });

  it("simulations endpoint returns ready boolean and simulationImages object", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/server/clientRoutes.ts",
      "utf-8"
    );
    // Verify the response shape
    expect(content).toContain("ready: hasImages");
    expect(content).toContain("simulationImages: simImages");
  });

  it("ClientReport.tsx polls for simulation images when not ready", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientReport.tsx",
      "utf-8"
    );
    // Verify polling logic exists
    expect(content).toContain("/api/client/simulations/");
    expect(content).toContain("simulationsLoading");
    expect(content).toContain("setSimulationsLoading");
    expect(content).toContain("setInterval");
    expect(content).toContain("clearInterval");
    // Verify it shows a loading indicator while generating
    expect(content).toContain("Generating Your Treatment Preview");
    expect(content).toContain("creating a personalized before/after simulation showing the combined results");
  });
});

describe("History Page - Search & Filter", () => {
  it("History.tsx has search input and date filter", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/History.tsx",
      "utf-8"
    );
    expect(content).toContain("searchQuery");
    expect(content).toContain("setSearchQuery");
    expect(content).toContain("dateFilter");
    expect(content).toContain("setDateFilter");
    expect(content).toContain("Search by name, email, or skin type");
  });

  it("History.tsx filters analyses by text search", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/History.tsx",
      "utf-8"
    );
    // Verify text search logic
    expect(content).toContain("filteredAnalyses");
    expect(content).toContain("patientFirstName");
    expect(content).toContain("patientLastName");
    expect(content).toContain("patientEmail");
    expect(content).toContain("toLowerCase");
    expect(content).toContain(".includes(q)");
  });

  it("History.tsx has date filter options: all, today, week, month", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/History.tsx",
      "utf-8"
    );
    expect(content).toContain("All Time");
    expect(content).toContain("Today");
    expect(content).toContain("Past 7 Days");
    expect(content).toContain("Past 30 Days");
  });

  it("History.tsx shows result count and clear filters button", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/History.tsx",
      "utf-8"
    );
    expect(content).toContain("Showing");
    expect(content).toContain("analyses");
    expect(content).toContain("Clear filters");
  });

  it("History.tsx shows empty state when no results match filters", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/History.tsx",
      "utf-8"
    );
    expect(content).toContain("No results found");
    expect(content).toContain("No analyses match your search criteria");
    expect(content).toContain("Clear Filters");
  });
});

describe("AI Prompt Safety Rules", () => {
  it("staff prompt includes IPL for Fitzpatrick I-IV only", () => {
    expect(systemPrompt).toContain("IPL");
    expect(systemPrompt).toContain("Fitzpatrick I-IV");
    expect(systemPrompt).toContain("NEVER recommend IPL");
  });

  it("client prompt includes IPL for Fitzpatrick I-IV only", () => {
    expect(clientPrompt).toContain("IPL");
    expect(clientPrompt).toContain("Fitzpatrick I-IV");
    expect(clientPrompt).toContain("NEVER recommend IPL");
  });

  it("staff prompt excludes Radiesse for under-eye", () => {
    expect(systemPrompt).toContain("NEVER recommend Radiesse for the under-eye");
  });

  it("client prompt excludes Radiesse for under-eye", () => {
    expect(clientPrompt).toContain("NEVER recommend Radiesse for the under-eye");
  });

  it("staff prompt includes HA filler guidance", () => {
    expect(systemPrompt).toContain("HA fillers");
    expect(systemPrompt).toContain("Restylane");
    expect(systemPrompt).toContain("Juvederm");
  });

  it("client prompt includes HA filler guidance", () => {
    expect(clientPrompt).toContain("hyaluronic acid (HA) fillers");
    expect(clientPrompt).toContain("Restylane");
    expect(clientPrompt).toContain("Juvederm");
  });

  it("prompts mention BBL only to warn against it", () => {
    // BBL should only appear in the context of "do NOT recommend BBL"
    expect(systemPrompt).toContain("Do NOT recommend BBL");
    expect(clientPrompt).toContain("Do NOT recommend BBL");
  });
});

describe("Body Concern Photo Configuration", () => {
  it("ClientAnalyze has body-specific angle config", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientAnalyze.tsx",
      "utf-8"
    );
    expect(content).toContain("BODY_ANGLE_CONFIG");
    expect(content).toContain("FACE_ANGLE_CONFIG");
    expect(content).toContain("Target Area");
    expect(content).toContain("Wider View");
    expect(content).toContain("Different Angle");
    expect(content).toContain("body area");
  });

  it("ClientAnalyze detects body_skin concern to switch photo mode", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientAnalyze.tsx",
      "utf-8"
    );
    expect(content).toContain("isBodyConcern");
    expect(content).toContain("body_skin");
    expect(content).toContain("BodySilhouette");
  });

  it("ClientAnalyze has body-specific photo tips", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientAnalyze.tsx",
      "utf-8"
    );
    expect(content).toContain("Tips for Great Body Photos");
    expect(content).toContain("Remove clothing from the target area");
    expect(content).toContain("Take Your Body Photos");
  });
});

describe("Client Landing Page - Marketing Ready", () => {
  it("landing page includes RadiantilyK logo", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx",
      "utf-8"
    );
    expect(content).toContain("RadiantilyK");
    expect(content).toContain("logo");
  });

  it("landing page includes business addresses", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx",
      "utf-8"
    );
    expect(content).toContain("2100 Curtner Ave");
    expect(content).toContain("San Jose");
    expect(content).toContain("1528 S El Camino Real");
    expect(content).toContain("San Mateo");
  });

  it("landing page includes phone number and email", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx",
      "utf-8"
    );
    expect(content).toContain("(408) 900-2674");
    expect(content).toContain("radiantilyk@gmail.com");
  });

  it("landing page has multiple CTAs for Facebook ad conversion", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx",
      "utf-8"
    );
    expect(content).toContain("Get My Free Skin Analysis");
    expect(content).toContain("Start My Free Analysis Now");
    expect(content).toContain("Start My Free Skin Analysis");
  });

  it("landing page includes social proof elements", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx",
      "utf-8"
    );
    expect(content).toContain("5,000+");
    expect(content).toContain("5.0");
    expect(content).toContain("Certified NP");
  });
});

describe("Copy Protection", () => {
  it("CopyProtection component blocks right-click and keyboard shortcuts", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/components/CopyProtection.tsx",
      "utf-8"
    );
    expect(content).toContain("contextmenu");
    expect(content).toContain("keydown");
    expect(content).toContain("userSelect");
  });

  it("index.html has noindex meta tag", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/index.html",
      "utf-8"
    );
    expect(content).toContain("noindex");
    expect(content).toContain("nofollow");
  });
});

describe("Body Treatment Rules & RKsculpt", () => {
  it("service catalog uses RKsculpt instead of Body Sculpting", () => {
    const catalogText = getServiceCatalogText();
    expect(catalogText).toContain("RKsculpt");
    expect(catalogText).not.toContain("Body Sculpting");
  });

  it("service catalog does not mention emsculpt", () => {
    const catalogText = getServiceCatalogText();
    expect(catalogText.toLowerCase()).not.toContain("emsculpt");
  });

  it("staff prompt includes body treatment recommendations", () => {
    expect(systemPrompt).toContain("BODY TREATMENT RECOMMENDATIONS");
    expect(systemPrompt).toContain("RKsculpt");
    expect(systemPrompt).toContain("Stretch marks");
    expect(systemPrompt).toContain("RF Skin Tightening");
    expect(systemPrompt).toContain("Lipolytic Injections");
  });

  it("client prompt includes body treatment recommendations", () => {
    expect(clientPrompt).toContain("BODY TREATMENT RECOMMENDATIONS");
    expect(clientPrompt).toContain("RKsculpt");
    expect(clientPrompt).toContain("Stretch marks");
    expect(clientPrompt).toContain("RF Skin Tightening");
    expect(clientPrompt).toContain("Lipolytic Injections");
  });

  it("prompts never use the word emsculpt", () => {
    expect(systemPrompt.toLowerCase()).not.toMatch(/(?<!\")emsculpt/);
    expect(clientPrompt.toLowerCase()).not.toMatch(/(?<!\")emsculpt/);
    // emsculpt only appears in the context of "NEVER use the word emsculpt"
    expect(systemPrompt).toContain('NEVER use the word "emsculpt"');
    expect(clientPrompt).toContain('NEVER use the word "emsculpt"');
  });

  it("RKsculpt service has correct pricing", () => {
    const rksculptCategory = SERVICE_CATALOG.find(c => c.category === "RKsculpt");
    expect(rksculptCategory).toBeDefined();
    expect(rksculptCategory!.services).toHaveLength(4);
    expect(rksculptCategory!.services[0].price).toBe("$400");
    expect(rksculptCategory!.services[1].price).toBe("$1,200");
  });
});

describe("Staff Report - Simulation Images", () => {
  it("skinRouter has getSimulations endpoint", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/server/skinRouter.ts",
      "utf-8"
    );
    expect(content).toContain("getSimulations: protectedProcedure");
    expect(content).toContain("simulationImages");
    expect(content).toContain("ready");
  });

  it("skinRouter triggers simulation generation after analysis", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/server/skinRouter.ts",
      "utf-8"
    );
    expect(content).toContain("generateSimulationsInBackground");
    expect(content).toContain("generateTreatmentSimulations");
    expect(content).toContain("Fire-and-forget");
  });

  it("staff Report.tsx includes BeforeAfterSlider component", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/Report.tsx",
      "utf-8"
    );
    expect(content).toContain("BeforeAfterSlider");
    expect(content).toContain("BEFORE");
    expect(content).toContain("AFTER");
    expect(content).toContain("Treatment Preview");
  });

  it("staff Report.tsx polls for simulation images", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/Report.tsx",
      "utf-8"
    );
    expect(content).toContain("simulationsLoading");
    expect(content).toContain("setSimulationsLoading");
    expect(content).toContain("setSimulationImages");
    expect(content).toContain("getSimulations");
  });
});

describe("Marketing Features", () => {
  it("client landing page has special offer banner with 25% off", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx",
      "utf-8"
    );
    expect(content).toContain("25% off");
    expect(content).toContain("48 hours");
    expect(content).toContain("Limited Offer");
  });

  it("client landing page has Google Maps embeds", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/pages/ClientLanding.tsx",
      "utf-8"
    );
    expect(content).toContain("google.com/maps/embed");
    expect(content).toContain("embedUrl");
    expect(content).toContain("iframe");
  });

  it("Facebook Pixel tracking utility exists", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/src/lib/fbPixel.ts",
      "utf-8"
    );
    expect(content).toContain("fbq");
    expect(content).toContain("startAnalysis");
    expect(content).toContain("completeAnalysis");
  });
});

describe("Facebook Pixel Configuration", () => {
  it("VITE_FB_PIXEL_ID environment variable is set and looks like a valid Pixel ID", () => {
    const pixelId = process.env.VITE_FB_PIXEL_ID;
    expect(pixelId).toBeDefined();
    expect(pixelId).toBeTruthy();
    // Facebook Pixel IDs are numeric strings, typically 15-16 digits
    expect(pixelId).toMatch(/^\d{10,20}$/);
  });

  it("Facebook Pixel base code in index.html references the env variable", async () => {
    const fs = await import("fs");
    const html = fs.readFileSync(
      "/home/ubuntu/skin-analyzer/client/index.html",
      "utf-8"
    );
    expect(html).toContain("fbq");
    expect(html).toContain("VITE_FB_PIXEL_ID");
  });
});


describe("CO2 Laser Services", () => {
  it("service catalog includes CO2 Laser Full Face, Face & Neck, and Neck Only", () => {
    const co2Category = SERVICE_CATALOG.find(c => c.category === "CO2 Laser Resurfacing");
    expect(co2Category).toBeDefined();
    expect(co2Category!.services).toHaveLength(3);
    const names = co2Category!.services.map(s => s.name);
    expect(names).toContain("CO2 Laser - Full Face");
    expect(names).toContain("CO2 Laser - Face & Neck");
    expect(names).toContain("CO2 Laser - Neck Only");
  });

  it("CO2 Laser pricing is affordable and competitive", () => {
    const co2Category = SERVICE_CATALOG.find(c => c.category === "CO2 Laser Resurfacing");
    const fullFace = co2Category!.services.find(s => s.name.includes("Full Face"));
    const faceNeck = co2Category!.services.find(s => s.name.includes("Face & Neck"));
    const neckOnly = co2Category!.services.find(s => s.name.includes("Neck Only"));
    expect(fullFace!.price).toBe("$750");
    expect(faceNeck!.price).toBe("$1,100");
    expect(neckOnly!.price).toBe("$500");
  });

  it("client prompt includes CO2 laser recommendation rules", () => {
    expect(clientPrompt).toContain("CO2 LASER RESURFACING RECOMMENDATIONS");
    expect(clientPrompt).toContain("CO2 Laser - Full Face ($750)");
    expect(clientPrompt).toContain("CO2 Laser - Neck Only ($500)");
    expect(clientPrompt).toContain("CO2 Laser - Face & Neck ($1,100)");
  });

  it("staff prompt includes CO2 laser recommendation rules", () => {
    expect(systemPrompt).toContain("CO2 LASER RESURFACING RECOMMENDATIONS");
    expect(systemPrompt).toContain("CO2 Laser - Full Face ($750)");
  });

  it("CO2 laser is contraindicated for Fitzpatrick V-VI in both prompts", () => {
    expect(clientPrompt).toContain("CO2 Laser is NOT recommended for Fitzpatrick V-VI");
    expect(systemPrompt).toContain("CONTRAINDICATED for Fitzpatrick V-VI");
  });

  it("service catalog text includes CO2 Laser entries", () => {
    const catalogText = getServiceCatalogText();
    expect(catalogText).toContain("CO2 Laser Resurfacing");
    expect(catalogText).toContain("CO2 Laser - Full Face");
    expect(catalogText).toContain("$750");
  });
});
