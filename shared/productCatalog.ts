/**
 * Complete skincare product catalog from RadiantilyK Aesthetic (rkaskin.co).
 * 
 * This data is used by the AI analysis engine to recommend only
 * skincare products that the clinic actually sells. Each product
 * includes SKU, name, price, category, and description.
 * 
 * Last updated: April 2026 — 53 products
 */

export interface ProductItem {
  sku: string;
  name: string;
  price: string;
  category: string;
  description: string;
  /** Key ingredients or benefits for AI matching */
  keyBenefits: string[];
  /** Product image URL from rkaskin.co storefront */
  imageUrl?: string;
  /** Direct link to product on rkaskin.co */
  shopUrl?: string;
}

export interface BundleDeal {
  id: string;
  name: string;
  tagline: string;
  discount: string;
  originalPrice: string;
  bundlePrice: string;
  savings: string;
  productSkus: string[];
  productNames: string[];
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
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-011_2def8715.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-012",
        name: "Images Nicotinamide Cleanser 60g",
        price: "$8.00",
        category: "Cleanser",
        description: "Nicotinamide-infused cleanser that purifies pores and improves skin clarity.",
        keyBenefits: ["pore purifying", "skin clarity", "nicotinamide", "brightening"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-012_85475610.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "SC-PHYTO-TONER-200",
        name: "SkinCeuticals Phyto Corrective Toner 200ml",
        price: "$38.00",
        category: "Cleanser",
        description: "Hydrating toner that instantly soothes and strengthens the epidermal barrier. Formulated with botanical extracts to calm sensitive, redness-prone skin.",
        keyBenefits: ["soothing", "barrier strengthening", "redness relief", "sensitive skin", "botanical extracts"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/skinceuticals-phyto-corrective-toner_a5e7ce49.webp",
        shopUrl: "https://rkaskin.co",
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
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-020_7b43b289.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-029",
        name: "Dermagarden Peptide-7 Cream 60g",
        price: "$38.00",
        category: "Cream",
        description: "Peptide-7 cream with seven active peptides for comprehensive anti-aging benefits.",
        keyBenefits: ["anti-aging", "peptides", "firming", "wrinkle reduction"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-029_28600e3d.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-021",
        name: "Dermagarden Vita C Cream 50g",
        price: "$32.00",
        category: "Cream",
        description: "Vitamin C-enriched cream that brightens and protects skin from oxidative stress.",
        keyBenefits: ["brightening", "vitamin C", "antioxidant", "oxidative protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-021_202dfd18.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-023",
        name: "EPTQ By.derm Intensive Cream 3.53 oz",
        price: "$36.00",
        category: "Cream",
        description: "Intensive moisturizing cream with peptides for deep hydration and skin repair.",
        keyBenefits: ["deep hydration", "peptides", "skin repair", "intensive moisturizing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-023_1ae395e0.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-024",
        name: "Generic Tone-Up Face Cream",
        price: "$12.00",
        category: "Cream",
        description: "Tone-up face cream that instantly brightens and evens out skin appearance.",
        keyBenefits: ["tone-up", "brightening", "even skin tone", "instant glow"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-024_92a75140.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-019",
        name: "Inspira Med Fair Complexion Cream 50ml",
        price: "$48.00",
        category: "Cream",
        description: "Brightening cream that evens skin tone and reduces dark spots for a fair complexion.",
        keyBenefits: ["brightening", "dark spot reduction", "even skin tone", "hyperpigmentation"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-019_322a29e9.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-001",
        name: "MOV Radiance Renewal Night Moisturizer",
        price: "$48.00",
        category: "Cream",
        description: "Renewing overnight moisturizer with microencapsulated vegan retinol, tranexamic acid, EGF, PDRN, and plant-derived exosomes for smoother, more refined skin. 30 mL.",
        keyBenefits: ["retinol", "tranexamic acid", "EGF", "PDRN", "exosomes", "night repair", "anti-aging", "skin refinement"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-radiance-renewal-night-moisturizer_e89f1085.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-009",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 100ml",
        price: "$38.00",
        category: "Cream",
        description: "Antioxidant-rich vitamin C moisturizer for deep hydration and radiance. Full size 100ml.",
        keyBenefits: ["vitamin C", "antioxidant", "hydration", "radiance"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/rka-vitc-moisturizer-100ml-mECrjDhvJ5kaMvYt7xCZmR.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-008",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 50ml",
        price: "$24.00",
        category: "Cream",
        description: "Brightening vitamin C moisturizer that hydrates and evens skin tone. Travel size 50ml.",
        keyBenefits: ["vitamin C", "brightening", "hydration", "travel size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/rka-vitc-moisturizer-50ml-VUrNgbmqJyekxrShTFXV2i.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "SIS-BR-EYE-14",
        name: "Sisley Black Rose Eye Contour Fluid 14ml",
        price: "$85.00",
        category: "Cream",
        description: "Luxury eye treatment that smooths, revitalizes, and illuminates the delicate eye area. Enriched with Black Rose extract for anti-aging benefits.",
        keyBenefits: ["eye treatment", "anti-aging", "luxury", "Black Rose extract", "under-eye", "dark circles", "fine lines"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sisley-black-rose-eye-contour_16b77f71.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "SIS-BR-CREAM-50",
        name: "Sisley Black Rose Skin Infusion Cream 50ml",
        price: "$115.00",
        category: "Cream",
        description: "Daily radiant plumping face cream with Black Rose extract. Restores elasticity, reinforces luminosity, and intensely moisturizes for a youthful, glowing complexion.",
        keyBenefits: ["luxury", "plumping", "elasticity", "luminosity", "Black Rose extract", "anti-aging", "intense moisture"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sisley-black-rose-skin-infusion-cream_fdbf0f14.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-022",
        name: "Skin Accents Wonder Glow Night Cream 50ml",
        price: "$26.00",
        category: "Cream",
        description: "Overnight glow cream that repairs and rejuvenates skin while you sleep.",
        keyBenefits: ["night repair", "rejuvenation", "glow", "overnight treatment"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-022_5c03aeb8.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "SC-PHYTO-A-30",
        name: "SkinCeuticals Phyto A+ Brightening Treatment 30ml",
        price: "$58.00",
        category: "Cream",
        description: "Oil-free brightening moisturizer with 3% Azelaic Acid and 2% Arbutin. Clinically proven to improve skin tone clarity, radiance, and texture. Ideal for sensitive, dull, or redness-prone skin.",
        keyBenefits: ["azelaic acid", "arbutin", "brightening", "oil-free", "redness", "sensitive skin", "texture improvement"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/skinceuticals-phyto-a-brightening_1394f160.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-025",
        name: "Waterfully GHK-Cu Copper Peptide Face Cream",
        price: "$22.00",
        category: "Cream",
        description: "Copper peptide face cream that boosts collagen production and firms aging skin.",
        keyBenefits: ["copper peptide", "collagen boost", "firming", "anti-aging"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-025_928751e1.jpg",
        shopUrl: "https://rkaskin.co",
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
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-005_9916f2d2.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-006",
        name: "FactorFive 7 Day Post Treatment Kit",
        price: "$58.00",
        category: "Post-Procedure",
        description: "7-day post-treatment recovery kit with growth factors to accelerate skin healing.",
        keyBenefits: ["post-treatment", "growth factors", "accelerated healing", "recovery"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-006_452c7714.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-004-1OZ",
        name: "MOV Cellular Repair Mist 1 oz",
        price: "$22.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Travel size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "post-procedure", "redness relief", "hydration"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-repair-mist_5413a849.jpeg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-004-1.69OZ",
        name: "MOV Cellular Repair Mist 1.69 oz",
        price: "$34.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Standard size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "post-procedure", "redness relief", "hydration"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-repair-mist_5413a849.jpeg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-004-3.4OZ",
        name: "MOV Cellular Repair Mist 3.4 oz",
        price: "$52.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Full size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "post-procedure", "redness relief", "hydration"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-repair-mist_5413a849.jpeg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-005",
        name: "MOV Tina Regence Recovery Exosome Serum",
        price: "$58.00",
        category: "Post-Procedure",
        description: "Clinically inspired recovery serum with plant exosomes, PDRN, ceramides, ectoin, and centella asiatica for advanced barrier restoration and post-procedure glow.",
        keyBenefits: ["exosomes", "PDRN", "ceramides", "barrier restoration", "post-procedure", "centella asiatica", "recovery"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-tina-regence-recovery-serum_4ce796fb.jpeg",
        shopUrl: "https://rkaskin.co",
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
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-028_73eb827a.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-026",
        name: "AIXIN Beauty Recovering Aging Wrinkle Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Anti-wrinkle serum that targets fine lines and restores youthful skin elasticity.",
        keyBenefits: ["anti-wrinkle", "fine lines", "elasticity", "anti-aging"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/aixin-recovering-aging-wrinkle-serum_83839c58.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-027",
        name: "AIXIN Beauty Scar & Mark Removing Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Scar and mark removing serum that fades blemishes and promotes smooth skin texture.",
        keyBenefits: ["scar removal", "blemish fading", "smooth texture", "mark reduction", "acne scars"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/aixin-scar-mark-serum_95c6d911.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-031",
        name: "AIXIN Beauty Vitamin B12 Whitening Serum 30ml",
        price: "$16.00",
        category: "Serum",
        description: "Vitamin B12 whitening serum that brightens and nourishes for a radiant complexion.",
        keyBenefits: ["vitamin B12", "whitening", "brightening", "nourishing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/aixin-vitb12-whitening-serum_328686b5.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-014",
        name: "Dermagarden Glutathione Serum 60ml",
        price: "$35.00",
        category: "Serum",
        description: "Glutathione antioxidant serum for skin brightening and protection against free radicals.",
        keyBenefits: ["glutathione", "antioxidant", "brightening", "free radical protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/dermagarden-glutathione-serum_cd6fa1cf.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-017",
        name: "Desembre A+ Aging Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Anti-aging serum with advanced peptides to reduce wrinkles and restore firmness.",
        keyBenefits: ["anti-aging", "peptides", "wrinkle reduction", "firmness"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-017_72f4af21.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-018",
        name: "Desembre P+ Pure Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Purifying science serum that detoxifies and balances skin for a clear, healthy glow.",
        keyBenefits: ["purifying", "detoxifying", "balancing", "clear skin"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-018_c8695ce6.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-015",
        name: "Desembre Serum Corrective 100ml",
        price: "$42.00",
        category: "Serum",
        description: "Corrective serum that targets fine lines, uneven texture, and dullness. Large 100ml size.",
        keyBenefits: ["corrective", "fine lines", "texture", "dullness", "large size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-015_55f158b7.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-016",
        name: "Desembre W+ White Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Whitening science serum that reduces hyperpigmentation for a luminous complexion.",
        keyBenefits: ["whitening", "hyperpigmentation", "luminous", "brightening"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-016_60174641.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-013",
        name: "Inspira Med Fair Complexion Serum 30ml",
        price: "$52.00",
        category: "Serum",
        description: "Brightening serum with fair complexion actives to reduce dark spots and uneven tone.",
        keyBenefits: ["brightening", "dark spots", "uneven tone", "fair complexion"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-013_1f1aca52.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-007",
        name: "MOV Cellular Silk Advanced Renewal Serum",
        price: "$52.00",
        category: "Serum",
        description: "Advanced dermal renewal serum featuring retinol (Vitamin A), 2% bakuchiol, PDRN, and plant-derived exosomes to visibly refine skin texture and support elasticity.",
        keyBenefits: ["retinol", "bakuchiol", "PDRN", "exosomes", "texture refinement", "elasticity", "anti-aging"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-silk-serum_1a90f914.jpeg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-006",
        name: "MOV Hristinka LUME Regenerative Elixir",
        price: "$48.00",
        category: "Serum",
        description: "Next-generation regenerative serum with bakuchiol, plant-derived exosomes, and PDRN to support collagen renewal, improve elasticity, and refine skin texture without irritation.",
        keyBenefits: ["bakuchiol", "exosomes", "PDRN", "collagen renewal", "elasticity", "gentle retinol alternative"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-hristinka-lume-elixir_6c7c3f96.jpeg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-003",
        name: "MOV Lash Regenerative Serum",
        price: "$32.00",
        category: "Serum",
        description: "Peptide-based lash conditioning formula with hydrolyzed keratin, panthenol, EGF, and botanical extracts to strengthen, condition, and support healthier-looking lashes.",
        keyBenefits: ["lash growth", "peptides", "keratin", "EGF", "lash conditioning"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-lash-regenerative-serum_9e78280f.jpeg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "MOV-002",
        name: "MOV Mandelic Refining Serum",
        price: "$42.00",
        category: "Serum",
        description: "Advanced skin renewal serum combining exfoliating mandelic and lactic acids with PDRN, EGF, copper peptide, bakuchiol, and tranexamic acid to refine texture and brighten tone.",
        keyBenefits: ["mandelic acid", "lactic acid", "PDRN", "EGF", "copper peptide", "exfoliation", "brightening", "texture refinement"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-mandelic-refining-serum_5993a54a.jpeg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-030",
        name: "RadiantilyK Aesthetic Vitamin C Facial Serum 1oz",
        price: "$28.00",
        category: "Serum",
        description: "Potent vitamin C facial serum for brightening, firming, and antioxidant protection.",
        keyBenefits: ["vitamin C", "brightening", "firming", "antioxidant"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/rka-vitc-serum-1oz-WNRA7nvDdtsCwqBWmJNU5y.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-010",
        name: "RadiantilyK Aesthetic Vitamin C Facial Serum 30ml",
        price: "$28.00",
        category: "Serum",
        description: "Concentrated vitamin C serum to brighten, firm, and protect against environmental damage.",
        keyBenefits: ["vitamin C", "brightening", "firming", "environmental protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-010_06d47d7b.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-034",
        name: "RadiantilyK Bioactive Enzyme Serum",
        price: "$32.00",
        category: "Serum",
        description: "Refined exfoliating serum with fermented pomegranate enzymes, lactobacillus ferment, MSM, and papaya fruit extract to visibly smooth, renew, and restore radiance.",
        keyBenefits: ["enzyme exfoliation", "fermented", "pomegranate", "papaya", "smoothing", "radiance", "cell renewal"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/rka-bioactive-enzyme-serum_c3580d0d.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-035",
        name: "RadiantilyK Peptide Complex Serum",
        price: "$32.00",
        category: "Serum",
        description: "Triple peptide serum with palmitoyl tripeptide-5, palmitoyl tripeptide-1, palmitoyl tetrapeptide-7, aloe, and centella asiatica to promote firmer, smoother, more youthful-looking skin.",
        keyBenefits: ["triple peptide", "firming", "anti-aging", "centella asiatica", "collagen support", "smoothing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/rka-peptide-complex-serum_4fed4c99.png",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-033",
        name: "RadiantilyK Resurfacing Serum",
        price: "$38.00",
        category: "Serum",
        description: "Advanced multi-peptide brightening serum with PDRN, EGF, exosomes, and niacinamide that hydrates, refines texture, improves tone, and supports collagen.",
        keyBenefits: ["PDRN", "EGF", "exosomes", "niacinamide", "resurfacing", "brightening", "collagen support", "texture refinement"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/rka-resurfacing-serum_64248bda.jpeg",
        shopUrl: "https://rkaskin.co",
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
        description: "A nourishing, all-in-one tinted moisturizer that delivers a luminous dewy glow with SPF 46 broad-spectrum UVA/UVB protection. Universal tint adapts to all skin tones.",
        keyBenefits: ["SPF 46", "tinted", "dewy finish", "universal tint", "UVA/UVB protection", "hydrating"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/barubt-dewy-spf46-Zg6BJxAUNNYfgC674FRfbL.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "BRB-001",
        name: "BARUBT Matte Universal Tinted Moisturizer SPF 46",
        price: "$34.00",
        category: "Sunscreen",
        description: "A lightweight, all-in-one tinted moisturizer that delivers a smooth matte finish with SPF 46 broad-spectrum UVA/UVB protection. Controls shine and minimizes pores.",
        keyBenefits: ["SPF 46", "tinted", "matte finish", "universal tint", "UVA/UVB protection", "oil control", "pore minimizing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/barubt-matte-spf46-ZpmrLcxjV9AqrK5fxXvXbF.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-007",
        name: "EELHOE Sun Cream SPF90 40g",
        price: "$20.00",
        category: "Sunscreen",
        description: "High SPF90 sun cream providing strong UV protection for daily outdoor exposure.",
        keyBenefits: ["SPF90", "UV protection", "sun protection", "daily use"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-007_bc1d5bd4.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "ELTA-002",
        name: "EltaMD UV AOX Elements Tinted Broad-Spectrum SPF 50",
        price: "$39.00",
        category: "Sunscreen",
        description: "Tinted mineral sunscreen with SPF 50 broad-spectrum protection. Features antioxidant-rich formula with transparent zinc oxide for all skin types.",
        keyBenefits: ["SPF 50", "mineral", "tinted", "antioxidant", "zinc oxide", "all skin types"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/OlTGD1wav9ki_6c90a666.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "ELTA-004",
        name: "EltaMD UV Clear Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Untinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea. Oil-free.",
        keyBenefits: ["SPF 46", "niacinamide", "acne-prone", "rosacea", "oil-free", "zinc oxide", "calming"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/i3tMHMn6UCGB_519245c8.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "ELTA-003",
        name: "EltaMD UV Clear Tinted Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Tinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea.",
        keyBenefits: ["SPF 46", "tinted", "niacinamide", "acne-prone", "rosacea", "zinc oxide", "calming"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/M7WbohP3iEPh_c725f1de.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "ELTA-001",
        name: "EltaMD UV Daily Tinted Broad-Spectrum SPF 40",
        price: "$36.00",
        category: "Sunscreen",
        description: "Lightweight tinted daily sunscreen with SPF 40 broad-spectrum UVA/UVB protection. Formulated with hyaluronic acid and transparent zinc oxide. Ideal for dry and combination skin.",
        keyBenefits: ["SPF 40", "tinted", "hyaluronic acid", "daily use", "dry skin", "combination skin"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/gEyGMSyHg1nc_90128e09.jpg",
        shopUrl: "https://rkaskin.co",
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
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-003_09e591f3.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-001",
        name: "IMAGE Skincare Peel Protect Repeat Post-Treatment Trial Kit",
        price: "$28.00",
        category: "Trial Kit",
        description: "Post-treatment recovery kit with soothing essentials to calm and protect freshly treated skin.",
        keyBenefits: ["post-treatment", "soothing", "recovery", "skin protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-001_1520e926.webp",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-004",
        name: "Indie Lee Skincare Set",
        price: "$26.00",
        category: "Trial Kit",
        description: "Clean beauty skincare set with natural botanicals for a fresh, radiant complexion.",
        keyBenefits: ["clean beauty", "natural", "botanicals", "radiant complexion"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-004_1e22f58b.jpg",
        shopUrl: "https://rkaskin.co",
      },
      {
        sku: "RKA-002",
        name: "iS Clinical Pure Calm Trial Kit",
        price: "$48.00",
        category: "Trial Kit",
        description: "Gentle trial kit designed for sensitive, reactive skin prone to redness and irritation.",
        keyBenefits: ["sensitive skin", "reactive skin", "redness", "calming"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-002_8deed0f1.jpg",
        shopUrl: "https://rkaskin.co",
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

  text += "PRODUCT RECOMMENDATION GUIDELINES:\n";
  text += "- For ACNE / OILY SKIN: EltaMD UV Clear SPF 46 (niacinamide), MOV Mandelic Refining Serum, Desembre P+ Pure Science Serum, Images Nicotinamide Cleanser\n";
  text += "- For AGING / WRINKLES: MOV Radiance Renewal Night Moisturizer (retinol+EGF), Dermagarden Peptide-7 Cream, RadiantilyK Peptide Complex Serum, MOV Cellular Silk Advanced Renewal Serum\n";
  text += "- For HYPERPIGMENTATION / DARK SPOTS: Inspira Med Fair Complexion Serum, Desembre W+ White Science Serum, SkinCeuticals Phyto A+ Brightening Treatment, RadiantilyK Resurfacing Serum\n";
  text += "- For DRYNESS / DEHYDRATION: Sisley Black Rose Skin Infusion Cream, EPTQ By.derm Intensive Cream, RadiantilyK Vitamin C Moisturizer, BARUBT Dewy Tinted Moisturizer SPF 46\n";
  text += "- For SENSITIVE / REDNESS / ROSACEA: SkinCeuticals Phyto Corrective Toner, Dermagarden Clear Cream, EltaMD UV Clear SPF 46, Dermalogica Sensitive Skin Rescue Kit\n";
  text += "- For POST-PROCEDURE RECOVERY: MOV Tina Regence Recovery Exosome Serum, MOV Cellular Repair Mist, FactorFive 7 Day Post Treatment Kit, Cosmedix Post Treatment Kit\n";
  text += "- For TEXTURE / DULLNESS: RadiantilyK Bioactive Enzyme Serum, MOV Mandelic Refining Serum, Desembre Serum Corrective, RadiantilyK Resurfacing Serum\n";
  text += "- For UNDER-EYE CONCERNS: Sisley Black Rose Eye Contour Fluid\n";
  text += "- For SCARS / MARKS: AIXIN Beauty Scar & Mark Removing Serum, RadiantilyK Resurfacing Serum\n";
  text += "- For LASH ENHANCEMENT: MOV Lash Regenerative Serum\n";
  text += "- For SUN PROTECTION: EltaMD UV Clear SPF 46 (acne/rosacea), EltaMD UV AOX Elements SPF 50 (all skin), BARUBT Matte SPF 46 (oily), BARUBT Dewy SPF 46 (dry)\n";
  text += "- ALWAYS recommend a sunscreen for every client\n\n";

  for (const cat of PRODUCT_CATALOG) {
    text += `--- ${cat.category} ---\n`;
    for (const prod of cat.products) {
      text += `  • [${prod.sku}] ${prod.name} — ${prod.price}\n`;
      text += `    ${prod.description}\n`;
      text += `    Benefits: ${prod.keyBenefits.join(", ")}\n`;
    }
    text += "\n";
  }

  text += "\n=== BUNDLE DEALS (Save up to 21%) ===\n";
  text += "When recommending multiple products that match a bundle, ALWAYS suggest the bundle deal instead to save the client money.\n\n";
  for (const bundle of BUNDLE_DEALS) {
    text += `  🎁 ${bundle.name} — ${bundle.bundlePrice} (was ${bundle.originalPrice}, save ${bundle.savings})\n`;
    text += `     ${bundle.tagline}\n`;
    text += `     Includes: ${bundle.productNames.join(" + ")}\n\n`;
  }
  text += "=== END OF PRODUCT CATALOG ===\n";
  return text;
}

export const BUNDLE_DEALS: BundleDeal[] = [
  {
    id: "bundle-anti-aging",
    name: "Anti-Aging Power Duo",
    tagline: "Turn back the clock, day & night",
    discount: "20% OFF",
    originalPrice: "$100.00",
    bundlePrice: "$80.00",
    savings: "$20.00",
    productSkus: ["MOV-001", "MOV-007"],
    productNames: ["MOV Radiance Renewal Night Moisturizer", "MOV Cellular Silk Advanced Renewal Serum"],
  },
  {
    id: "bundle-brightening",
    name: "Brightening Essentials",
    tagline: "Your daily glow-up routine",
    discount: "20% OFF",
    originalPrice: "$60.00",
    bundlePrice: "$48.00",
    savings: "$12.00",
    productSkus: ["RKA-011", "RKA-008", "RKA-030"],
    productNames: ["Images Hyaluronic Acid Cleanser 60g", "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 50ml", "RadiantilyK Aesthetic Vitamin C Facial Serum 1oz"],
  },
  {
    id: "bundle-peptide",
    name: "Complete Peptide Renewal",
    tagline: "Firm, plump & rejuvenate",
    discount: "20% OFF",
    originalPrice: "$102.00",
    bundlePrice: "$82.00",
    savings: "$20.00",
    productSkus: ["RKA-029", "MOV-003", "RKA-PCS"],
    productNames: ["Dermagarden Peptide-7 Cream 60g", "MOV Lash Regenerative Serum", "RadiantilyK Peptide Complex Serum"],
  },
  {
    id: "bundle-post-procedure",
    name: "Post-Procedure Recovery Set",
    tagline: "Heal faster, glow sooner",
    discount: "20% OFF",
    originalPrice: "$92.00",
    bundlePrice: "$74.00",
    savings: "$18.00",
    productSkus: ["MOV-005", "MOV-004-1.69OZ"],
    productNames: ["MOV Tina Regence Recovery Exosome Serum", "MOV Cellular Repair Mist 1.69 oz"],
  },
  {
    id: "bundle-sun-shield",
    name: "Sun & Skin Shield",
    tagline: "Protect, calm, repeat",
    discount: "20% OFF",
    originalPrice: "$70.00",
    bundlePrice: "$56.00",
    savings: "$14.00",
    productSkus: ["RKA-020", "ELT-UV-CLEAR-46"],
    productNames: ["Dermagarden Clear Cream 50g", "EltaMD UV Clear Broad-Spectrum SPF 46"],
  },
];

/**
 * Given a list of recommended product SKUs, find matching bundle deals.
 */
export function findMatchingBundles(recommendedSkus: string[]): BundleDeal[] {
  return BUNDLE_DEALS.filter((bundle) =>
    bundle.productSkus.every((sku) => recommendedSkus.includes(sku))
  );
}

/**
 * Given a list of recommended product names, find matching bundle deals (fuzzy).
 */
export function findMatchingBundlesByName(recommendedNames: string[]): BundleDeal[] {
  const lowerNames = recommendedNames.map((n) => n.toLowerCase());
  return BUNDLE_DEALS.filter((bundle) =>
    bundle.productNames.every((bundleProd) =>
      lowerNames.some((recName) => recName.includes(bundleProd.toLowerCase()) || bundleProd.toLowerCase().includes(recName))
    )
  );
}
