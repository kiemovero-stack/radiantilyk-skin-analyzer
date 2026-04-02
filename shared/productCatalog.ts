/**
 * Complete skincare product catalog from RadiantilyK Aesthetic (rkaskin.co).
 * 
 * This data is used by the AI analysis engine to recommend only
 * skincare products that the clinic actually sells. Each product
 * includes SKU, name, price, category, and description.
 * 
 * Last updated: April 2, 2026 — 49 products
 */

export interface ProductItem {
  sku: string;
  name: string;
  price: string;
  category: string;
  description: string;
  /** Key ingredients or benefits for AI matching */
  keyBenefits: string[];
}

export interface ProductCategory {
  category: string;
  products: ProductItem[];
}

export const PRODUCT_CATALOG: ProductCategory[] = [
  {
    category: "Cleansers",
    products: [
      {
        sku: "RKA-011",
        name: "Images Hyaluronic Acid Cleanser 60g",
        price: "$8.00",
        category: "Cleanser",
        description: "Gentle hyaluronic acid cleanser that refreshes and deeply hydrates while cleansing.",
        keyBenefits: ["hydration", "gentle cleansing", "hyaluronic acid"],
      },
      {
        sku: "RKA-012",
        name: "Images Nicotinamide Cleanser 60g",
        price: "$8.00",
        category: "Cleanser",
        description: "Nicotinamide-infused cleanser that purifies pores and improves skin clarity.",
        keyBenefits: ["pore purifying", "skin clarity", "nicotinamide", "brightening"],
      },
    ],
  },
  {
    category: "Creams",
    products: [
      {
        sku: "RKA-020",
        name: "Dermagarden Clear Cream 50g",
        price: "$32.00",
        category: "Cream",
        description: "Soothing clear cream that calms irritation and strengthens the skin barrier.",
        keyBenefits: ["barrier repair", "soothing", "irritation relief", "sensitive skin"],
      },
      {
        sku: "RKA-029",
        name: "Dermagarden Peptide-7 Cream 60g",
        price: "$38.00",
        category: "Cream",
        description: "Peptide-7 cream with seven active peptides for comprehensive anti-aging benefits.",
        keyBenefits: ["anti-aging", "peptides", "firming", "wrinkle reduction"],
      },
      {
        sku: "RKA-021",
        name: "Dermagarden Vita C Cream 50g",
        price: "$32.00",
        category: "Cream",
        description: "Vitamin C-enriched cream that brightens and protects skin from oxidative stress.",
        keyBenefits: ["brightening", "vitamin C", "antioxidant", "oxidative protection"],
      },
      {
        sku: "RKA-023",
        name: "EPTQ By.derm Intensive Cream 3.53 oz",
        price: "$36.00",
        category: "Cream",
        description: "Intensive moisturizing cream with peptides for deep hydration and skin repair.",
        keyBenefits: ["deep hydration", "peptides", "skin repair", "intensive moisturizing"],
      },
      {
        sku: "RKA-024",
        name: "Generic Tone-Up Face Cream",
        price: "$12.00",
        category: "Cream",
        description: "Tone-up face cream that instantly brightens and evens out skin appearance.",
        keyBenefits: ["tone-up", "brightening", "even skin tone", "instant glow"],
      },
      {
        sku: "RKA-019",
        name: "Inspira Med Fair Complexion Cream 50ml",
        price: "$48.00",
        category: "Cream",
        description: "Brightening cream that evens skin tone and reduces dark spots for a fair complexion.",
        keyBenefits: ["brightening", "dark spot reduction", "even skin tone", "hyperpigmentation"],
      },
      {
        sku: "MOV-001",
        name: "MOV Radiance Renewal Night Moisturizer",
        price: "$48.00",
        category: "Cream",
        description: "Renewing overnight moisturizer with microencapsulated vegan retinol, tranexamic acid, EGF, PDRN, and plant-derived exosomes for smoother, more refined skin. 30 mL / 1 fl oz.",
        keyBenefits: ["retinol", "tranexamic acid", "EGF", "PDRN", "exosomes", "night repair", "anti-aging"],
      },
      {
        sku: "RKA-009",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 100ml",
        price: "$38.00",
        category: "Cream",
        description: "Antioxidant-rich vitamin C moisturizer for deep hydration and radiance. Full size 100ml.",
        keyBenefits: ["vitamin C", "antioxidant", "hydration", "radiance"],
      },
      {
        sku: "RKA-008",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 50ml",
        price: "$24.00",
        category: "Cream",
        description: "Brightening vitamin C moisturizer that hydrates and evens skin tone. Travel size 50ml.",
        keyBenefits: ["vitamin C", "brightening", "hydration", "travel size"],
      },
      {
        sku: "RKA-022",
        name: "Skin Accents Wonder Glow Night Cream 50ml",
        price: "$26.00",
        category: "Cream",
        description: "Overnight glow cream that repairs and rejuvenates skin while you sleep.",
        keyBenefits: ["night repair", "rejuvenation", "glow", "overnight treatment"],
      },
      {
        sku: "RKA-025",
        name: "Waterfully GHK-Cu Copper Peptide Face Cream",
        price: "$22.00",
        category: "Cream",
        description: "Copper peptide face cream that boosts collagen production and firms aging skin.",
        keyBenefits: ["copper peptide", "collagen boost", "firming", "anti-aging"],
      },
    ],
  },
  {
    category: "Post-Procedure",
    products: [
      {
        sku: "RKA-005",
        name: "Cosmedix Post Treatment 4-Piece Essentials Kit",
        price: "$38.00",
        category: "Post-Procedure",
        description: "Four-piece post-procedure essentials to soothe, hydrate, and protect healing skin.",
        keyBenefits: ["post-procedure", "soothing", "healing", "skin recovery"],
      },
      {
        sku: "RKA-006",
        name: "FactorFive 7 Day Post Treatment Kit",
        price: "$58.00",
        category: "Post-Procedure",
        description: "7-day post-treatment recovery kit with growth factors to accelerate skin healing.",
        keyBenefits: ["post-treatment", "growth factors", "accelerated healing", "recovery"],
      },
      {
        sku: "MOV-004-1OZ",
        name: "MOV Cellular Repair Mist 1 oz",
        price: "$22.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Travel-friendly 1 oz / 30 mL size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "post-procedure", "redness relief", "travel size"],
      },
      {
        sku: "MOV-004-1.69OZ",
        name: "MOV Cellular Repair Mist 1.69 oz",
        price: "$34.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Standard 1.69 oz / 50 mL size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "post-procedure", "redness relief"],
      },
      {
        sku: "MOV-004-3.4OZ",
        name: "MOV Cellular Repair Mist 3.4 oz",
        price: "$52.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Full-size 3.4 oz / 100 mL bottle.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "post-procedure", "redness relief", "full size"],
      },
      {
        sku: "MOV-005",
        name: "MOV Tina Regence Recovery Exosome Serum",
        price: "$58.00",
        category: "Post-Procedure",
        description: "Clinically inspired recovery serum with plant exosomes, PDRN, ceramides, ectoin, and centella asiatica for advanced barrier restoration and post-procedure glow. 30 mL / 1 fl oz.",
        keyBenefits: ["exosomes", "PDRN", "ceramides", "centella asiatica", "barrier restoration", "post-procedure"],
      },
    ],
  },
  {
    category: "Serums",
    products: [
      {
        sku: "RKA-028",
        name: "AIXIN Beauty EGF Revitalizing Serum 30ml",
        price: "$18.00",
        category: "Serum",
        description: "EGF revitalizing serum that stimulates cell renewal for fresher, younger-looking skin.",
        keyBenefits: ["EGF", "cell renewal", "revitalizing", "anti-aging"],
      },
      {
        sku: "RKA-026",
        name: "AIXIN Beauty Recovering Aging Wrinkle Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Anti-wrinkle serum that targets fine lines and restores youthful skin elasticity.",
        keyBenefits: ["anti-wrinkle", "fine lines", "elasticity", "anti-aging"],
      },
      {
        sku: "RKA-027",
        name: "AIXIN Beauty Scar & Mark Removing Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Scar and mark removing serum that fades blemishes and promotes smooth skin texture.",
        keyBenefits: ["scar removal", "blemish fading", "smooth texture", "mark reduction"],
      },
      {
        sku: "RKA-031",
        name: "AIXIN Beauty Vitamin B12 Whitening Serum 30ml",
        price: "$16.00",
        category: "Serum",
        description: "Vitamin B12 whitening serum that brightens and nourishes for a radiant complexion.",
        keyBenefits: ["vitamin B12", "whitening", "brightening", "nourishing"],
      },
      {
        sku: "RKA-014",
        name: "Dermagarden Glutathione Serum 60ml",
        price: "$35.00",
        category: "Serum",
        description: "Glutathione antioxidant serum for skin brightening and protection against free radicals.",
        keyBenefits: ["glutathione", "antioxidant", "brightening", "free radical protection"],
      },
      {
        sku: "RKA-017",
        name: "Desembre A+ Aging Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Anti-aging serum with advanced peptides to reduce wrinkles and restore firmness.",
        keyBenefits: ["anti-aging", "peptides", "wrinkle reduction", "firmness"],
      },
      {
        sku: "RKA-018",
        name: "Desembre P+ Pure Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Purifying science serum that detoxifies and balances skin for a clear, healthy glow.",
        keyBenefits: ["purifying", "detoxifying", "balancing", "clear skin"],
      },
      {
        sku: "RKA-015",
        name: "Desembre Serum Corrective 100ml",
        price: "$42.00",
        category: "Serum",
        description: "Corrective serum that targets fine lines, uneven texture, and dullness. Large 100ml size.",
        keyBenefits: ["corrective", "fine lines", "texture", "dullness", "large size"],
      },
      {
        sku: "RKA-016",
        name: "Desembre W+ White Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Whitening science serum that reduces hyperpigmentation for a luminous complexion.",
        keyBenefits: ["whitening", "hyperpigmentation", "luminous", "brightening"],
      },
      {
        sku: "RKA-013",
        name: "Inspira Med Fair Complexion Serum 30ml",
        price: "$52.00",
        category: "Serum",
        description: "Brightening serum with fair complexion actives to reduce dark spots and uneven tone.",
        keyBenefits: ["brightening", "dark spots", "uneven tone", "fair complexion"],
      },
      {
        sku: "MOV-007",
        name: "MOV Cellular Silk Advanced Renewal Serum",
        price: "$52.00",
        category: "Serum",
        description: "Advanced dermal renewal serum featuring retinol (Vitamin A), 2% bakuchiol, PDRN, and plant-derived exosomes to visibly refine skin texture and support elasticity. 30 mL / 1 fl oz.",
        keyBenefits: ["retinol", "bakuchiol", "PDRN", "exosomes", "texture refinement", "elasticity", "anti-aging"],
      },
      {
        sku: "MOV-006",
        name: "MOV Hristinka LUME Regenerative Elixir",
        price: "$48.00",
        category: "Serum",
        description: "Next-generation regenerative serum with bakuchiol, plant-derived exosomes, and PDRN to support collagen renewal, improve elasticity, and refine skin texture without irritation. 30 mL / 1 fl oz.",
        keyBenefits: ["bakuchiol", "exosomes", "PDRN", "collagen renewal", "elasticity", "gentle retinol alternative"],
      },
      {
        sku: "MOV-003",
        name: "MOV Lash Regenerative Serum",
        price: "$32.00",
        category: "Serum",
        description: "Peptide-based lash conditioning formula with hydrolyzed keratin, panthenol, EGF, and botanical extracts to strengthen, condition, and support healthier-looking lashes. 8 mL / 0.27 fl oz.",
        keyBenefits: ["lash growth", "peptides", "keratin", "EGF", "lash conditioning"],
      },
      {
        sku: "MOV-002",
        name: "MOV Mandelic Refining Serum",
        price: "$42.00",
        category: "Serum",
        description: "Advanced skin renewal serum combining exfoliating mandelic and lactic acids with PDRN, EGF, copper peptide, bakuchiol, and tranexamic acid to refine texture and brighten tone. 30 mL / 1 fl oz.",
        keyBenefits: ["mandelic acid", "lactic acid", "PDRN", "EGF", "copper peptide", "exfoliating", "brightening"],
      },
      {
        sku: "RKA-030",
        name: "RadiantilyK Aesthetic Vitamin C Facial Serum 1oz",
        price: "$28.00",
        category: "Serum",
        description: "Potent vitamin C facial serum for brightening, firming, and antioxidant protection.",
        keyBenefits: ["vitamin C", "brightening", "firming", "antioxidant"],
      },
      {
        sku: "RKA-010",
        name: "RadiantilyK Aesthetic Vitamin C Facial Serum 30ml",
        price: "$28.00",
        category: "Serum",
        description: "Concentrated vitamin C serum to brighten, firm, and protect against environmental damage.",
        keyBenefits: ["vitamin C", "brightening", "firming", "environmental protection"],
      },
      {
        sku: "RKA-034",
        name: "RadiantilyK Bioactive Enzyme Serum",
        price: "$32.00",
        category: "Serum",
        description: "Refined exfoliating serum with fermented pomegranate enzymes, lactobacillus ferment, MSM, and papaya fruit extract to visibly smooth, renew, and restore radiance. 1 oz / 30 mL.",
        keyBenefits: ["enzyme exfoliation", "fermented ingredients", "MSM", "papaya", "radiance", "smoothing"],
      },
      {
        sku: "RKA-035",
        name: "RadiantilyK Peptide Complex Serum",
        price: "$32.00",
        category: "Serum",
        description: "Triple peptide serum with palmitoyl tripeptide-5, palmitoyl tripeptide-1, palmitoyl tetrapeptide-7, aloe, and centella asiatica to promote firmer, smoother, more youthful-looking skin. 1 oz / 30 mL.",
        keyBenefits: ["triple peptide", "firming", "smoothing", "centella asiatica", "anti-aging"],
      },
      {
        sku: "RKA-033",
        name: "RadiantilyK Resurfacing Serum",
        price: "$38.00",
        category: "Serum",
        description: "Advanced multi-peptide brightening serum with PDRN, EGF, exosomes, and niacinamide that hydrates, refines texture, improves tone, and supports collagen. 1 oz / 30 mL.",
        keyBenefits: ["PDRN", "EGF", "exosomes", "niacinamide", "resurfacing", "collagen support", "brightening"],
      },
    ],
  },
  {
    category: "Sunscreen",
    products: [
      {
        sku: "BRB-002",
        name: "BARUBT Dewy Universal Tinted Moisturizer SPF 46",
        price: "$34.00",
        category: "Sunscreen",
        description: "A nourishing, all-in-one tinted moisturizer that delivers a luminous dewy glow with SPF 46 broad-spectrum UVA/UVB protection. The universal tint adapts to all skin tones. 1.7 fl oz / 50mL.",
        keyBenefits: ["SPF 46", "tinted", "dewy finish", "universal tint", "UVA/UVB protection", "hydrating"],
      },
      {
        sku: "BRB-001",
        name: "BARUBT Matte Universal Tinted Moisturizer SPF 46",
        price: "$34.00",
        category: "Sunscreen",
        description: "A lightweight, all-in-one tinted moisturizer that delivers a smooth matte finish with SPF 46 broad-spectrum UVA/UVB protection. Controls shine and minimizes pores. 1.7 fl oz / 50mL.",
        keyBenefits: ["SPF 46", "tinted", "matte finish", "oil control", "pore minimizing", "UVA/UVB protection"],
      },
      {
        sku: "RKA-007",
        name: "EELHOE Sun Cream SPF90 40g",
        price: "$20.00",
        category: "Sunscreen",
        description: "High SPF90 sun cream providing strong UV protection for daily outdoor exposure.",
        keyBenefits: ["SPF90", "UV protection", "sun protection", "daily use"],
      },
      {
        sku: "ELTA-002",
        name: "EltaMD UV AOX Elements Tinted Broad-Spectrum SPF 50",
        price: "$39.00",
        category: "Sunscreen",
        description: "Tinted mineral sunscreen with SPF 50 broad-spectrum protection. Features antioxidant-rich formula with transparent zinc oxide for all skin types. 1.7 oz / 48 g.",
        keyBenefits: ["SPF 50", "mineral sunscreen", "tinted", "antioxidant", "zinc oxide", "all skin types"],
      },
      {
        sku: "ELTA-004",
        name: "EltaMD UV Clear Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Untinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea. Oil-free. 1.7 oz / 48 g.",
        keyBenefits: ["SPF 46", "niacinamide", "acne-prone skin", "rosacea", "oil-free", "zinc oxide"],
      },
      {
        sku: "ELTA-003",
        name: "EltaMD UV Clear Tinted Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Tinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea. 1.7 oz / 48 g.",
        keyBenefits: ["SPF 46", "tinted", "niacinamide", "acne-prone skin", "rosacea", "zinc oxide"],
      },
      {
        sku: "ELTA-001",
        name: "EltaMD UV Daily Tinted Broad-Spectrum SPF 40",
        price: "$36.00",
        category: "Sunscreen",
        description: "Lightweight tinted daily sunscreen with SPF 40 broad-spectrum UVA/UVB protection. Formulated with hyaluronic acid and transparent zinc oxide. Ideal for dry and combination skin. 1.7 oz / 48 g.",
        keyBenefits: ["SPF 40", "tinted", "hyaluronic acid", "daily use", "dry skin", "combination skin"],
      },
    ],
  },
  {
    category: "Trial Kits",
    products: [
      {
        sku: "RKA-003",
        name: "Dermalogica Sensitive Skin Rescue Kit",
        price: "$34.00",
        category: "Trial Kit",
        description: "Rescue kit for sensitive skin with calming ingredients to reduce redness and discomfort.",
        keyBenefits: ["sensitive skin", "calming", "redness reduction", "rescue kit"],
      },
      {
        sku: "RKA-001",
        name: "IMAGE Skincare Peel Protect Repeat Post-Treatment Trial Kit",
        price: "$28.00",
        category: "Trial Kit",
        description: "Post-treatment recovery kit with soothing essentials to calm and protect freshly treated skin.",
        keyBenefits: ["post-treatment", "soothing", "recovery", "skin protection"],
      },
      {
        sku: "RKA-004",
        name: "Indie Lee Skincare Set",
        price: "$26.00",
        category: "Trial Kit",
        description: "Clean beauty skincare set with natural botanicals for a fresh, radiant complexion.",
        keyBenefits: ["clean beauty", "natural", "botanicals", "radiant complexion"],
      },
      {
        sku: "RKA-002",
        name: "iS Clinical Pure Calm Trial Kit",
        price: "$48.00",
        category: "Trial Kit",
        description: "Gentle trial kit designed for sensitive, reactive skin prone to redness and irritation.",
        keyBenefits: ["sensitive skin", "reactive skin", "redness", "calming"],
      },
    ],
  },
  {
    category: "Bundle Deals",
    products: [
      {
        sku: "BUNDLE-001",
        name: "Anti-Aging Power Duo",
        price: "$80.00",
        category: "Bundle",
        description: "Turn back the clock, day & night. Includes MOV Radiance Renewal Night Moisturizer + MOV Cellular Silk Advanced Renewal Serum. Save 20% ($100 value).",
        keyBenefits: ["anti-aging", "retinol", "exosomes", "PDRN", "day and night", "bundle savings"],
      },
      {
        sku: "BUNDLE-002",
        name: "Brightening Essentials",
        price: "$48.00",
        category: "Bundle",
        description: "Your daily glow-up routine. Includes Images Hyaluronic Acid Cleanser + RadiantilyK Vitamin C Moisturizer 50ml + RadiantilyK Vitamin C Serum 1oz. Save 20% ($60 value).",
        keyBenefits: ["brightening", "vitamin C", "daily routine", "glow", "bundle savings"],
      },
      {
        sku: "BUNDLE-003",
        name: "Complete Peptide Renewal",
        price: "$82.00",
        category: "Bundle",
        description: "Firm, plump & rejuvenate. Includes Dermagarden Peptide-7 Cream + MOV Lash Regenerative Serum + RadiantilyK Peptide Complex Serum. Save 20% ($102 value).",
        keyBenefits: ["peptides", "firming", "rejuvenation", "lash care", "bundle savings"],
      },
      {
        sku: "BUNDLE-004",
        name: "Post-Procedure Recovery Set",
        price: "$74.00",
        category: "Bundle",
        description: "Heal faster, glow sooner. Includes MOV Tina Regence Recovery Exosome Serum + MOV Cellular Repair Mist 1.69 oz. Save 20% ($92 value).",
        keyBenefits: ["post-procedure", "exosomes", "recovery", "healing", "bundle savings"],
      },
      {
        sku: "BUNDLE-005",
        name: "Sun & Skin Shield",
        price: "$56.00",
        category: "Bundle",
        description: "Protect, calm, repeat. Includes Dermagarden Clear Cream + EltaMD UV Clear SPF 46. Save 20% ($70 value).",
        keyBenefits: ["sun protection", "barrier repair", "calming", "SPF", "bundle savings"],
      },
    ],
  },
];

/**
 * Get the total number of products in the catalog.
 */
export function getProductCount(): number {
  return PRODUCT_CATALOG.reduce((total, cat) => total + cat.products.length, 0);
}

/**
 * Generate a formatted text version of the product catalog for the AI prompt.
 */
export function getProductCatalogText(): string {
  let text = "=== RADIANTILYK AESTHETIC SKINCARE PRODUCT CATALOG ===\n\n";
  text += "IMPORTANT: When recommending skincare products, you MUST ONLY recommend products from this catalog.\n";
  text += "Include the exact product name, SKU, price, and explain why it's recommended for the patient's specific conditions.\n";
  text += "Available at: https://rkaskin.co\n\n";

  for (const cat of PRODUCT_CATALOG) {
    text += `--- ${cat.category} ---\n`;
    for (const prod of cat.products) {
      text += `  • [${prod.sku}] ${prod.name} — ${prod.price}\n`;
      text += `    ${prod.description}\n`;
      text += `    Benefits: ${prod.keyBenefits.join(", ")}\n`;
    }
    text += "\n";
  }

  text += "=== END OF PRODUCT CATALOG ===\n";
  return text;
}
