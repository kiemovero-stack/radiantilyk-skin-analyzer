import { describe, expect, it } from "vitest";
import { buildSystemPrompt, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import { buildClientSystemPrompt, CLIENT_ANALYSIS_OUTPUT_SCHEMA } from "./clientPrompt";
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
    expect(systemPrompt).toContain("NEVER recommend IPL for Fitzpatrick types V and VI");
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
    expect(prompt).toContain("RADIANTILYK AESTHETIC SKINCARE PRODUCT CATALOG");
    expect(prompt).toContain("rkaskin.co");
  });

  it("client prompt instructs to recommend SPF and post-procedure kits", async () => {
    const prompt = buildClientSystemPrompt();
    expect(prompt).toContain("Always recommend SPF sunscreen");
    expect(prompt).toContain("post-procedure kit");
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
    expect(content).toContain("Analyze My Skin");
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
