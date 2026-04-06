/**
 * Complete skincare product catalog from RadiantilyK Aesthetic storefront.
 * 
 * This data is used by the AI analysis engine to recommend only
 * skincare products that the clinic actually sells. Each product
 * includes SKU, name, price, category, and description.
 * 
 * Last updated: April 2026 — 67 products, 15 bundle deals
 */

export interface ProductItem {
  sku: string;
  name: string;
  price: string;
  category: string;
  description: string;
  /** Key ingredients or benefits for AI matching */
  keyBenefits: string[];
  /** Product image URL from storefront */
  imageUrl?: string;
  /** Direct link to product on storefront */
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

const STORE_URL = "https://radiantshop-gqunaun6.manus.space";

export const PRODUCT_CATALOG: ProductCategory[] = [
  {
    category: "Cleansers & Toners",
    products: [
      {
        sku: "RKA-011",
        name: "Images Hyaluronic Acid Cleanser 60g",
        price: "$8.00",
        category: "Cleanser",
        description: "Gentle hyaluronic acid cleanser that refreshes and deeply hydrates while cleansing.",
        keyBenefits: ["hydration", "gentle cleansing", "hyaluronic acid"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-011_2def8715.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-012",
        name: "Images Nicotinamide Cleanser 60g",
        price: "$8.00",
        category: "Cleanser",
        description: "Nicotinamide-infused cleanser that purifies pores and improves skin clarity.",
        keyBenefits: ["pore purifying", "niacinamide", "skin clarity", "oil control"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-012_85475610.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-PHYTO-TONER-200",
        name: "SkinCeuticals Phyto Corrective Toner 200ml",
        price: "$38.00",
        category: "Cleanser",
        description: "Hydrating toner that instantly soothes and strengthens the epidermal barrier. Formulated with botanical extracts to calm sensitive, redness-prone skin.",
        keyBenefits: ["soothing", "barrier repair", "redness reduction", "botanical extracts", "sensitive skin"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/skinceuticals-phyto-corrective-toner_a5e7ce49.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "ZO-RENEW-PADS-60",
        name: "ZO Skin Health Complexion Renewal Pads 60ct",
        price: "$36.00",
        category: "Cleanser",
        description: "Exfoliating pads that remove excess oil and pore-clogging debris. 100% plant-based formula with glycolic and salicylic acid for clearer, smoother skin.",
        keyBenefits: ["exfoliation", "glycolic acid", "salicylic acid", "oil control", "pore clearing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/BegRyjGrbojfoavv_2fbafbe4.png",
        shopUrl: STORE_URL,
      },
    ],
  },
  {
    category: "Creams & Moisturizers",
    products: [
      {
        sku: "RKA-020",
        name: "Dermagarden Clear Cream 50g",
        price: "$32.00",
        category: "Cream",
        description: "Soothing clear cream that calms irritation and strengthens the skin barrier.",
        keyBenefits: ["soothing", "barrier repair", "anti-irritation", "calming"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-020_7b43b289.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-029",
        name: "Dermagarden Peptide-7 Cream 60g",
        price: "$38.00",
        category: "Cream",
        description: "Peptide-7 cream with seven active peptides for comprehensive anti-aging benefits.",
        keyBenefits: ["anti-aging", "peptides", "firming", "wrinkle reduction", "collagen support"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-029_28600e3d.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-021",
        name: "Dermagarden Vita C Cream 50g",
        price: "$32.00",
        category: "Cream",
        description: "Vitamin C-enriched cream that brightens and protects skin from oxidative stress.",
        keyBenefits: ["vitamin C", "brightening", "antioxidant", "oxidative protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-021_202dfd18.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-023",
        name: "EPTQ By.derm Intensive Cream 3.53 oz",
        price: "$36.00",
        category: "Cream",
        description: "Intensive moisturizing cream with peptides for deep hydration and skin repair.",
        keyBenefits: ["deep hydration", "peptides", "skin repair", "intensive moisturizing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-023_1ae395e0.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-024",
        name: "Generic Tone-Up Face Cream",
        price: "$12.00",
        category: "Cream",
        description: "Tone-up face cream that instantly brightens and evens out skin appearance.",
        keyBenefits: ["tone-up", "brightening", "even skin tone", "affordable"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-024_92a75140.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-019",
        name: "Inspira Med Fair Complexion Cream 50ml",
        price: "$48.00",
        category: "Cream",
        description: "Brightening cream that evens skin tone and reduces dark spots for a fair complexion.",
        keyBenefits: ["brightening", "dark spot reduction", "even skin tone", "hyperpigmentation"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-019_322a29e9.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "KIEHLS-EYE-AVO-14",
        name: "Kiehl's Creamy Eye Treatment with Avocado 14ml",
        price: "$20.00",
        category: "Cream",
        description: "Rich, creamy under-eye treatment with Avocado Oil that moisturizes and nourishes the delicate eye area. Ophthalmologist and dermatologist tested.",
        keyBenefits: ["under-eye care", "avocado oil", "moisturizing", "nourishing", "gentle"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/aRgNMRjlWqdMYDRi_a08ceb48.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "KIEHLS-ULTRA-FC-50",
        name: "Kiehl's Ultra Facial Cream 50ml",
        price: "$24.00",
        category: "Cream",
        description: "Bestselling 24-hour daily moisturizer with Squalane and Glacial Glycoprotein for up to 72-hour hydration. Lightweight, non-greasy formula for all skin types.",
        keyBenefits: ["24-hour hydration", "squalane", "lightweight", "all skin types", "non-greasy"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/kiehls-ultra-facial-cream_91653d6a.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-001",
        name: "MOV Radiance Renewal Night Moisturizer",
        price: "$48.00",
        category: "Cream",
        description: "Renewing overnight moisturizer with microencapsulated vegan retinol, tranexamic acid, EGF, PDRN, and plant-derived exosomes for smoother, more refined skin.",
        keyBenefits: ["retinol", "EGF", "PDRN", "exosomes", "tranexamic acid", "overnight renewal", "anti-aging"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-radiance-renewal-night-moisturizer_e89f1085.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-009",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 100ml",
        price: "$38.00",
        category: "Cream",
        description: "Antioxidant-rich vitamin C moisturizer for deep hydration and radiance. Full size 100ml.",
        keyBenefits: ["vitamin C", "antioxidant", "hydration", "radiance", "full size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/rka-vitc-moisturizer-100ml-mECrjDhvJ5kaMvYt7xCZmR.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-008",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 50ml",
        price: "$24.00",
        category: "Cream",
        description: "Brightening vitamin C moisturizer that hydrates and evens skin tone. Travel size 50ml.",
        keyBenefits: ["vitamin C", "brightening", "hydration", "travel size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/rka-vitc-moisturizer-50ml-VUrNgbmqJyekxrShTFXV2i.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-GHKCU-30",
        name: "RadiantilyK GHK-Cu Copper Peptides Face Cream 30g",
        price: "$38.00",
        category: "Cream",
        description: "Our signature firming and repairing face cream powered by GHK-Cu copper peptides. Visibly tightens, firms, and repairs skin while fighting signs of aging.",
        keyBenefits: ["copper peptides", "GHK-Cu", "firming", "repairing", "anti-aging", "tightening"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/ghk-cu-cream-4uWVxXHAaPcEurLVEN3mfq.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "SIS-BR-EYE-14",
        name: "Sisley Black Rose Eye Contour Fluid 14ml",
        price: "$85.00",
        category: "Cream",
        description: "Luxury eye treatment that smooths, revitalizes, and illuminates the delicate eye area. Enriched with Black Rose extract for anti-aging benefits.",
        keyBenefits: ["luxury", "eye treatment", "Black Rose", "anti-aging", "illuminating", "smoothing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sisley-black-rose-eye-contour_16b77f71.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SIS-BR-CREAM-50",
        name: "Sisley Black Rose Skin Infusion Cream 50ml",
        price: "$115.00",
        category: "Cream",
        description: "Daily radiant plumping face cream with Black Rose extract. Restores elasticity, reinforces luminosity, and intensely moisturizes for a youthful, glowing complexion.",
        keyBenefits: ["luxury", "plumping", "Black Rose", "elasticity", "luminosity", "intense hydration"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sisley-black-rose-skin-infusion-cream_fdbf0f14.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-022",
        name: "Skin Accents Wonder Glow Night Cream 50ml",
        price: "$26.00",
        category: "Cream",
        description: "Overnight glow cream that repairs and rejuvenates skin while you sleep.",
        keyBenefits: ["overnight repair", "glow", "rejuvenation", "night cream"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-022_5c03aeb8.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-AGE-ADV-48",
        name: "SkinCeuticals A.G.E. Interrupter Advanced 48ml",
        price: "$88.00",
        category: "Cream",
        description: "Award-winning anti-wrinkle cream that corrects and defends against visible signs of aging. Clinically proven to improve wrinkles in five key facial zones.",
        keyBenefits: ["anti-wrinkle", "clinical grade", "A.G.E. technology", "advanced anti-aging"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/QvxBJkJBRWcaKczh_ce4bc469.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-PHYTO-A-30",
        name: "SkinCeuticals Phyto A+ Brightening Treatment 30ml",
        price: "$58.00",
        category: "Cream",
        description: "Oil-free brightening moisturizer with 3% Azelaic Acid and 2% Arbutin. Clinically proven to improve skin tone clarity, radiance, and texture. Ideal for sensitive, dull, or redness-prone skin.",
        keyBenefits: ["azelaic acid", "arbutin", "brightening", "oil-free", "redness", "sensitive skin", "texture"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/skinceuticals-phyto-a-brightening_1394f160.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-025",
        name: "Waterfully GHK-Cu Copper Peptide Face Cream",
        price: "$22.00",
        category: "Cream",
        description: "Copper peptide face cream that boosts collagen production and firms aging skin.",
        keyBenefits: ["copper peptides", "collagen boost", "firming", "anti-aging", "affordable"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-025_928751e1.jpg",
        shopUrl: STORE_URL,
      },
    ],
  },
  {
    category: "Lip Care",
    products: [
      {
        sku: "SF-LBB-BROWNSUGAR",
        name: "Summer Fridays Lip Butter Balm - Brown Sugar",
        price: "$14.00",
        category: "Cream",
        description: "Deep brown-tinted vegan lip balm with a warm, caramel-inspired shade. Nourishes lips while delivering a rich, sophisticated color.",
        keyBenefits: ["lip care", "tinted", "vegan", "nourishing", "brown sugar shade"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sf-brown-sugar_801b2b8d.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-ICEDCOFFEE",
        name: "Summer Fridays Lip Butter Balm - Iced Coffee",
        price: "$14.00",
        category: "Cream",
        description: "Rich brown-tinted vegan lip balm with a coffee-inspired shade. Moisturizes and adds a warm, neutral tint for an effortless everyday look.",
        keyBenefits: ["lip care", "tinted", "vegan", "moisturizing", "iced coffee shade"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sf-iced-coffee_51ba2b42.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-PINKSUGAR",
        name: "Summer Fridays Lip Butter Balm - Pink Sugar",
        price: "$14.00",
        category: "Cream",
        description: "Tinted vegan lip balm in a sweet pink shade with a sugary scent. Delivers hydration, nourishment, and a pop of rosy color.",
        keyBenefits: ["lip care", "tinted", "vegan", "hydrating", "pink sugar shade"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sf-pink-sugar_33e6382e.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-TOASTMRSH",
        name: "Summer Fridays Lip Butter Balm - Toasted Marshmallow",
        price: "$14.00",
        category: "Cream",
        description: "Shimmery nude vegan lip balm with a touch of golden shimmer and toasted marshmallow sweetness. Limited edition fan favorite.",
        keyBenefits: ["lip care", "shimmer", "vegan", "limited edition", "toasted marshmallow"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sf-toasted-marshmallow_ca1c624c.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-VANILLA",
        name: "Summer Fridays Lip Butter Balm - Vanilla",
        price: "$14.00",
        category: "Cream",
        description: "The original bestselling vegan lip balm that conditions and softens dry lips with a sweet vanilla flavor. Instant moisture and shine.",
        keyBenefits: ["lip care", "bestseller", "vegan", "vanilla", "conditioning", "moisture"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sf-vanilla_7ec0087a.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-VANBEIGE",
        name: "Summer Fridays Lip Butter Balm - Vanilla Beige",
        price: "$14.00",
        category: "Cream",
        description: "Silky vegan lip balm with a sheer beige tint and hint of vanilla. Hydrates and soothes parched lips instantly with a buttery, glossy finish.",
        keyBenefits: ["lip care", "sheer tint", "vegan", "vanilla beige", "glossy", "hydrating"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/sf-vanilla-beige_5f2af412.jpg",
        shopUrl: STORE_URL,
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
        keyBenefits: ["post-procedure", "soothing", "healing", "hydration", "protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-005_9916f2d2.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-006",
        name: "FactorFive 7 Day Post Treatment Kit",
        price: "$58.00",
        category: "Post-Procedure",
        description: "7-day post-treatment recovery kit with growth factors to accelerate skin healing.",
        keyBenefits: ["growth factors", "post-procedure", "7-day recovery", "accelerated healing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-006_452c7714.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-004-1OZ",
        name: "MOV Cellular Repair Mist 1 oz",
        price: "$22.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Travel-friendly size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "soothing", "travel size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-repair-mist_5413a849.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-004-1.69OZ",
        name: "MOV Cellular Repair Mist 1.69 oz",
        price: "$34.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Standard size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "soothing", "standard size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-repair-mist_5413a849.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-004-3.4OZ",
        name: "MOV Cellular Repair Mist 3.4 oz",
        price: "$52.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Full-size bottle.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "soothing", "full size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-repair-mist_5413a849.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-005",
        name: "MOV Tina Regence Recovery Exosome Serum",
        price: "$58.00",
        category: "Post-Procedure",
        description: "Clinically inspired recovery serum with plant exosomes, PDRN, ceramides, ectoin, and centella asiatica for advanced barrier restoration and post-procedure glow.",
        keyBenefits: ["exosomes", "PDRN", "ceramides", "ectoin", "centella", "barrier restoration", "recovery"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-tina-regence-recovery-serum_4ce796fb.jpeg",
        shopUrl: STORE_URL,
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
        keyBenefits: ["EGF", "cell renewal", "revitalizing", "anti-aging", "affordable"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-028_73eb827a.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-026",
        name: "AIXIN Beauty Recovering Aging Wrinkle Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Anti-wrinkle serum that targets fine lines and restores youthful skin elasticity.",
        keyBenefits: ["anti-wrinkle", "fine lines", "elasticity", "affordable"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/aixin-recovering-aging-wrinkle-serum_83839c58.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-027",
        name: "AIXIN Beauty Scar & Mark Removing Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Scar and mark removing serum that fades blemishes and promotes smooth skin texture.",
        keyBenefits: ["scar fading", "mark removal", "smooth texture", "blemish reduction", "affordable"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/aixin-scar-mark-serum_95c6d911.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-031",
        name: "AIXIN Beauty Vitamin B12 Whitening Serum 30ml",
        price: "$16.00",
        category: "Serum",
        description: "Vitamin B12 whitening serum that brightens and nourishes for a radiant complexion.",
        keyBenefits: ["vitamin B12", "brightening", "nourishing", "radiance", "affordable"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/aixin-vitb12-whitening-serum_328686b5.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "CLAR-DS-EYE-20",
        name: "Clarins Double Serum Eye 20ml",
        price: "$42.00",
        category: "Serum",
        description: "Dual-phase eye concentrate with 13 plant extracts that addresses all visible signs of aging around the eyes. Smooths, firms, and brightens the eye area.",
        keyBenefits: ["eye serum", "dual-phase", "13 plant extracts", "anti-aging", "firming", "brightening"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/qqEWkLPQWagKxgxc_3a846d23.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-014",
        name: "Dermagarden Glutathione Serum 60ml",
        price: "$35.00",
        category: "Serum",
        description: "Glutathione antioxidant serum for skin brightening and protection against free radicals.",
        keyBenefits: ["glutathione", "antioxidant", "brightening", "free radical protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/dermagarden-glutathione-serum_cd6fa1cf.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-017",
        name: "Desembre A+ Aging Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Anti-aging serum with advanced peptides to reduce wrinkles and restore firmness.",
        keyBenefits: ["anti-aging", "peptides", "wrinkle reduction", "firmness"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-017_72f4af21.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-018",
        name: "Desembre P+ Pure Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Purifying science serum that detoxifies and balances skin for a clear, healthy glow.",
        keyBenefits: ["purifying", "detoxifying", "balancing", "clear skin"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-018_c8695ce6.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-015",
        name: "Desembre Serum Corrective 100ml",
        price: "$42.00",
        category: "Serum",
        description: "Corrective serum that targets fine lines, uneven texture, and dullness. Large 100ml size.",
        keyBenefits: ["corrective", "fine lines", "texture", "dullness", "large size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-015_55f158b7.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-016",
        name: "Desembre W+ White Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Whitening science serum that reduces hyperpigmentation for a luminous complexion.",
        keyBenefits: ["whitening", "hyperpigmentation", "luminous", "brightening"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-016_60174641.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-013",
        name: "Inspira Med Fair Complexion Serum 30ml",
        price: "$52.00",
        category: "Serum",
        description: "Brightening serum with fair complexion actives to reduce dark spots and uneven tone.",
        keyBenefits: ["brightening", "dark spots", "even tone", "fair complexion"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-013_1f1aca52.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "KIEHLS-VITC-50",
        name: "Kiehl's Powerful-Strength Vitamin C Serum 50ml",
        price: "$42.00",
        category: "Serum",
        description: "Potent 12.5% Vitamin C serum with Hyaluronic Acid that visibly reduces fine lines and brightens skin in just 2 weeks. Paraben-free and alcohol-free.",
        keyBenefits: ["12.5% vitamin C", "hyaluronic acid", "fine lines", "brightening", "paraben-free"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/ItJAjEIlNYaUsQta_16938e71.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-007",
        name: "MOV Cellular Silk Advanced Renewal Serum",
        price: "$52.00",
        category: "Serum",
        description: "Advanced dermal renewal serum featuring retinol (Vitamin A), 2% bakuchiol, PDRN, and plant-derived exosomes to visibly refine skin texture and support elasticity.",
        keyBenefits: ["retinol", "bakuchiol", "PDRN", "exosomes", "texture refinement", "elasticity"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-cellular-silk-serum_1a90f914.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-006",
        name: "MOV Hristinka LUME Regenerative Elixir",
        price: "$48.00",
        category: "Serum",
        description: "Next-generation regenerative serum with bakuchiol, plant-derived exosomes, and PDRN to support collagen renewal, improve elasticity, and refine skin texture without irritation.",
        keyBenefits: ["bakuchiol", "exosomes", "PDRN", "collagen renewal", "elasticity", "gentle"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-hristinka-lume-elixir_6c7c3f96.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-003",
        name: "MOV Lash Regenerative Serum",
        price: "$32.00",
        category: "Serum",
        description: "Peptide-based lash conditioning formula with hydrolyzed keratin, panthenol, EGF, and botanical extracts to strengthen, condition, and support healthier-looking lashes.",
        keyBenefits: ["lash growth", "peptides", "keratin", "EGF", "conditioning"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-lash-regenerative-serum_9e78280f.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-002",
        name: "MOV Mandelic Refining Serum",
        price: "$42.00",
        category: "Serum",
        description: "Advanced skin renewal serum combining exfoliating mandelic and lactic acids with PDRN, EGF, copper peptide, bakuchiol, and tranexamic acid to refine texture and brighten tone.",
        keyBenefits: ["mandelic acid", "lactic acid", "PDRN", "EGF", "copper peptide", "exfoliating", "brightening"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/mov-mandelic-refining-serum_5993a54a.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-030",
        name: "RadiantilyK Aesthetic Vitamin C Facial Serum 1oz",
        price: "$28.00",
        category: "Serum",
        description: "Potent vitamin C facial serum for brightening, firming, and antioxidant protection.",
        keyBenefits: ["vitamin C", "brightening", "firming", "antioxidant"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/rka-vitc-serum-1oz-WNRA7nvDdtsCwqBWmJNU5y.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-010",
        name: "RadiantilyK Aesthetic Vitamin C Facial Serum 30ml",
        price: "$28.00",
        category: "Serum",
        description: "Concentrated vitamin C serum to brighten, firm, and protect against environmental damage.",
        keyBenefits: ["vitamin C", "brightening", "firming", "environmental protection"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-010_06d47d7b.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-034",
        name: "RadiantilyK Bioactive Enzyme Serum",
        price: "$32.00",
        category: "Serum",
        description: "Refined exfoliating serum with fermented pomegranate enzymes, lactobacillus ferment, MSM, and papaya fruit extract to visibly smooth, renew, and restore radiance.",
        keyBenefits: ["enzyme exfoliation", "fermented", "pomegranate", "MSM", "papaya", "radiance"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/rka-bioactive-enzyme-serum_c3580d0d.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-035",
        name: "RadiantilyK Peptide Complex Serum",
        price: "$32.00",
        category: "Serum",
        description: "Triple peptide serum with palmitoyl tripeptide-5, palmitoyl tripeptide-1, palmitoyl tetrapeptide-7, aloe, and centella asiatica to promote firmer, smoother, more youthful-looking skin.",
        keyBenefits: ["triple peptide", "firming", "smoothing", "centella", "aloe", "anti-aging"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/rka-peptide-complex-serum_4fed4c99.png",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-033",
        name: "RadiantilyK Resurfacing Serum",
        price: "$38.00",
        category: "Serum",
        description: "Advanced multi-peptide brightening serum with PDRN, EGF, exosomes, and niacinamide that hydrates, refines texture, improves tone, and supports collagen.",
        keyBenefits: ["PDRN", "EGF", "exosomes", "niacinamide", "resurfacing", "collagen support", "brightening"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/rka-resurfacing-serum_64248bda.jpeg",
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-PTIOX-30",
        name: "SkinCeuticals P-TIOX Peptide Serum 30ml",
        price: "$82.00",
        category: "Serum",
        description: "Wrinkle-modulating peptide serum inspired by anti-wrinkle neurotoxin effects. Reduces the appearance of 9 types of expression lines for glass-skin radiance.",
        keyBenefits: ["peptide", "wrinkle modulating", "expression lines", "glass skin", "clinical grade"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/fulqavAMiTdqTzTR_a11060d3.jpg",
        shopUrl: STORE_URL,
      },
    ],
  },
  {
    category: "Sunscreens",
    products: [
      {
        sku: "BRB-002",
        name: "BARUBT Dewy Universal Tinted Moisturizer SPF 46",
        price: "$34.00",
        category: "Sunscreen",
        description: "A nourishing, all-in-one tinted moisturizer that delivers a luminous dewy glow with SPF 46 broad-spectrum UVA/UVB protection. The universal tint adapts to all skin tones.",
        keyBenefits: ["SPF 46", "dewy finish", "tinted", "universal shade", "moisturizing", "UVA/UVB"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/barubt-dewy-spf46-Zg6BJxAUNNYfgC674FRfbL.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "BRB-001",
        name: "BARUBT Matte Universal Tinted Moisturizer SPF 46",
        price: "$34.00",
        category: "Sunscreen",
        description: "A lightweight, all-in-one tinted moisturizer that delivers a smooth matte finish with SPF 46 broad-spectrum UVA/UVB protection. Controls shine and minimizes pores.",
        keyBenefits: ["SPF 46", "matte finish", "tinted", "universal shade", "oil control", "pore minimizing"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/barubt-matte-spf46-ZpmrLcxjV9AqrK5fxXvXbF.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-007",
        name: "EELHOE Sun Cream SPF90 40g",
        price: "$20.00",
        category: "Sunscreen",
        description: "High SPF90 sun cream providing strong UV protection for daily outdoor exposure.",
        keyBenefits: ["SPF 90", "high protection", "UV shield", "outdoor", "affordable"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-007_bc1d5bd4.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-002",
        name: "EltaMD UV AOX Elements Tinted Broad-Spectrum SPF 50",
        price: "$39.00",
        category: "Sunscreen",
        description: "Tinted mineral sunscreen with SPF 50 broad-spectrum protection. Features antioxidant-rich formula with transparent zinc oxide for all skin types.",
        keyBenefits: ["SPF 50", "mineral", "tinted", "antioxidant", "zinc oxide", "all skin types"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/OlTGD1wav9ki_6c90a666.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-004",
        name: "EltaMD UV Clear Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Untinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea. Oil-free.",
        keyBenefits: ["SPF 46", "niacinamide", "zinc oxide", "acne-safe", "rosacea-safe", "oil-free"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/i3tMHMn6UCGB_519245c8.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-003",
        name: "EltaMD UV Clear Tinted Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Tinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea.",
        keyBenefits: ["SPF 46", "tinted", "niacinamide", "zinc oxide", "acne-safe", "rosacea-safe"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/M7WbohP3iEPh_c725f1de.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-001",
        name: "EltaMD UV Daily Tinted Broad-Spectrum SPF 40",
        price: "$36.00",
        category: "Sunscreen",
        description: "Lightweight tinted daily sunscreen with SPF 40 broad-spectrum UVA/UVB protection. Formulated with hyaluronic acid and transparent zinc oxide for a moisture boost.",
        keyBenefits: ["SPF 40", "tinted", "hyaluronic acid", "zinc oxide", "daily wear", "lightweight"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/gQUNaUN6BpxY2cHrs4Z9XC/gEyGMSyHg1nc_90128e09.jpg",
        shopUrl: STORE_URL,
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
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-001",
        name: "IMAGE Skincare Peel Protect Repeat Post-Treatment Trial Kit",
        price: "$28.00",
        category: "Trial Kit",
        description: "Post-treatment recovery kit with soothing essentials to calm and protect freshly treated skin.",
        keyBenefits: ["post-treatment", "soothing", "calming", "protection", "trial size"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-001_1520e926.webp",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-004",
        name: "Indie Lee Skincare Set",
        price: "$26.00",
        category: "Trial Kit",
        description: "Clean beauty skincare set with natural botanicals for a fresh, radiant complexion.",
        keyBenefits: ["clean beauty", "natural", "botanicals", "radiance", "trial set"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-004_1e22f58b.jpg",
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-002",
        name: "iS Clinical Pure Calm Trial Kit",
        price: "$48.00",
        category: "Trial Kit",
        description: "Gentle trial kit designed for sensitive, reactive skin prone to redness and irritation.",
        keyBenefits: ["sensitive skin", "calming", "reactive skin", "redness", "clinical grade"],
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663224834738/dRqspyivBm9g9V7BZcsBdg/RKA-002_8deed0f1.jpg",
        shopUrl: STORE_URL,
      },
    ],
  },
];

/**
 * Build the product catalog text for AI prompts.
 * Includes product recommendation guidelines by skin concern.
 */
export function buildProductCatalogText(): string {
  let text = "=== SKINCARE PRODUCT CATALOG (RadiantilyK Aesthetic) ===\n";
  text += "67 products available. Recommend 5-7 products per client based on their specific concerns.\n";
  text += "ALWAYS include a sunscreen recommendation for every client.\n";
  text += "ALWAYS recommend a post-procedure product when recommending any in-office procedure.\n\n";

  text += "PRODUCT RECOMMENDATION GUIDELINES:\n";
  text += "- For ACNE / OILY SKIN: EltaMD UV Clear SPF 46 (niacinamide), MOV Mandelic Refining Serum, Desembre P+ Pure Science Serum, Images Nicotinamide Cleanser, ZO Skin Health Complexion Renewal Pads\n";
  text += "- For AGING / WRINKLES: MOV Radiance Renewal Night Moisturizer (retinol+EGF), Dermagarden Peptide-7 Cream, RadiantilyK Peptide Complex Serum, MOV Cellular Silk Advanced Renewal Serum, SkinCeuticals A.G.E. Interrupter Advanced, SkinCeuticals P-TIOX Peptide Serum, AIXIN Beauty Recovering Aging Wrinkle Serum\n";
  text += "- For HYPERPIGMENTATION / DARK SPOTS: Inspira Med Fair Complexion Serum, Desembre W+ White Science Serum, SkinCeuticals Phyto A+ Brightening Treatment, RadiantilyK Resurfacing Serum, AIXIN Beauty Vitamin B12 Whitening Serum, Dermagarden Glutathione Serum\n";
  text += "- For DRYNESS / DEHYDRATION: Sisley Black Rose Skin Infusion Cream, EPTQ By.derm Intensive Cream, Kiehl's Ultra Facial Cream, RadiantilyK Vitamin C Moisturizer, BARUBT Dewy Tinted Moisturizer SPF 46\n";
  text += "- For SENSITIVE / REDNESS / ROSACEA: SkinCeuticals Phyto Corrective Toner, SkinCeuticals Phyto A+ Brightening Treatment, Dermagarden Clear Cream, EltaMD UV Clear SPF 46, Dermalogica Sensitive Skin Rescue Kit, iS Clinical Pure Calm Trial Kit\n";
  text += "- For POST-PROCEDURE RECOVERY: MOV Tina Regence Recovery Exosome Serum, MOV Cellular Repair Mist (1oz/1.69oz/3.4oz), FactorFive 7 Day Post Treatment Kit, Cosmedix Post Treatment Kit, IMAGE Skincare Post-Treatment Trial Kit\n";
  text += "- For TEXTURE / DULLNESS: RadiantilyK Bioactive Enzyme Serum, MOV Mandelic Refining Serum, Desembre Serum Corrective, RadiantilyK Resurfacing Serum, ZO Skin Health Complexion Renewal Pads\n";
  text += "- For UNDER-EYE CONCERNS: Sisley Black Rose Eye Contour Fluid, Kiehl's Creamy Eye Treatment with Avocado, Clarins Double Serum Eye\n";
  text += "- For SCARS / MARKS: AIXIN Beauty Scar & Mark Removing Serum, RadiantilyK Resurfacing Serum, AIXIN Beauty EGF Revitalizing Serum\n";
  text += "- For LASH ENHANCEMENT: MOV Lash Regenerative Serum\n";
  text += "- For FIRMING / COLLAGEN: RadiantilyK GHK-Cu Copper Peptides Face Cream, Waterfully GHK-Cu Copper Peptide Face Cream, RadiantilyK Peptide Complex Serum, MOV Hristinka LUME Regenerative Elixir\n";
  text += "- For BRIGHTENING / VITAMIN C: Kiehl's Powerful-Strength Vitamin C Serum, RadiantilyK Vitamin C Facial Serum, RadiantilyK Vitamin C Facial Moisturizer, Dermagarden Vita C Cream\n";
  text += "- For LIP CARE: Summer Fridays Lip Butter Balm (Vanilla, Pink Sugar, Iced Coffee, Brown Sugar, Vanilla Beige, Toasted Marshmallow)\n";
  text += "- For SUN PROTECTION: EltaMD UV Clear SPF 46 (acne/rosacea), EltaMD UV Clear Tinted SPF 46, EltaMD UV AOX Elements SPF 50 (all skin), EltaMD UV Daily Tinted SPF 40, BARUBT Matte SPF 46 (oily), BARUBT Dewy SPF 46 (dry), EELHOE Sun Cream SPF90\n";
  text += "- ALWAYS recommend a sunscreen for every client\n";
  text += "- ALWAYS recommend a post-procedure recovery product when recommending any in-office procedure\n\n";

  for (const cat of PRODUCT_CATALOG) {
    text += `--- ${cat.category} ---\n`;
    for (const prod of cat.products) {
      text += `  • [${prod.sku}] ${prod.name} — ${prod.price}\n`;
      text += `    ${prod.description}\n`;
      text += `    Benefits: ${prod.keyBenefits.join(", ")}\n`;
    }
    text += "\n";
  }

  text += "\n=== BUNDLE DEALS (Save up to 22%) ===\n";
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
    productSkus: ["RKA-029", "MOV-003", "RKA-035"],
    productNames: ["Dermagarden Peptide-7 Cream 60g", "MOV Lash Regenerative Serum", "RadiantilyK Peptide Complex Serum"],
  },
  {
    id: "bundle-copper-peptide",
    name: "Copper Peptide Powerhouse",
    tagline: "Double the peptide power",
    discount: "20% OFF",
    originalPrice: "$60.00",
    bundlePrice: "$48.00",
    savings: "$12.00",
    productSkus: ["RKA-025", "RKA-GHKCU-30"],
    productNames: ["Waterfully GHK-Cu Copper Peptide Face Cream", "RadiantilyK GHK-Cu Copper Peptides Face Cream 30g"],
  },
  {
    id: "bundle-glow-protect",
    name: "Glow & Protect Daily Set",
    tagline: "Morning glow in 3 steps",
    discount: "21% OFF",
    originalPrice: "$104.00",
    bundlePrice: "$82.00",
    savings: "$22.00",
    productSkus: ["ELTA-004", "KIEHLS-ULTRA-FC-50", "KIEHLS-VITC-50"],
    productNames: ["EltaMD UV Clear Broad-Spectrum SPF 46", "Kiehl's Ultra Facial Cream 50ml", "Kiehl's Powerful-Strength Vitamin C Serum 50ml"],
  },
  {
    id: "bundle-kiehls-trio",
    name: "Kiehl's Essentials Trio",
    tagline: "Your daily Kiehl's ritual",
    discount: "21% OFF",
    originalPrice: "$86.00",
    bundlePrice: "$68.00",
    savings: "$18.00",
    productSkus: ["KIEHLS-EYE-AVO-14", "KIEHLS-ULTRA-FC-50", "KIEHLS-VITC-50"],
    productNames: ["Kiehl's Creamy Eye Treatment with Avocado 14ml", "Kiehl's Ultra Facial Cream 50ml", "Kiehl's Powerful-Strength Vitamin C Serum 50ml"],
  },
  {
    id: "bundle-luxury-eye",
    name: "Luxury Eye Revival",
    tagline: "Brighten & firm tired eyes",
    discount: "19% OFF",
    originalPrice: "$62.00",
    bundlePrice: "$50.00",
    savings: "$12.00",
    productSkus: ["KIEHLS-EYE-AVO-14", "CLAR-DS-EYE-20"],
    productNames: ["Kiehl's Creamy Eye Treatment with Avocado 14ml", "Clarins Double Serum Eye 20ml"],
  },
  {
    id: "bundle-welcome-kit",
    name: "New Client Welcome Kit",
    tagline: "Start your glow journey",
    discount: "22% OFF",
    originalPrice: "$80.00",
    bundlePrice: "$62.00",
    savings: "$18.00",
    productSkus: ["RKA-011", "RKA-008", "RKA-010", "RKA-007"],
    productNames: ["Images Hyaluronic Acid Cleanser 60g", "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 50ml", "RadiantilyK Aesthetic Vitamin C Facial Serum 30ml", "EELHOE Sun Cream SPF90 40g"],
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
    id: "bundle-rka-signature",
    name: "RadiantilyK Signature Glow",
    tagline: "Our best, all in one",
    discount: "20% OFF",
    originalPrice: "$98.00",
    bundlePrice: "$78.00",
    savings: "$20.00",
    productSkus: ["RKA-030", "RKA-035", "RKA-GHKCU-30"],
    productNames: ["RadiantilyK Aesthetic Vitamin C Facial Serum 1oz", "RadiantilyK Peptide Complex Serum", "RadiantilyK GHK-Cu Copper Peptides Face Cream 30g"],
  },
  {
    id: "bundle-sisley-luxury",
    name: "Sisley Black Rose Luxury Set",
    tagline: "Indulge in French luxury",
    discount: "21% OFF",
    originalPrice: "$200.00",
    bundlePrice: "$158.00",
    savings: "$42.00",
    productSkus: ["SIS-BR-EYE-14", "SIS-BR-CREAM-50"],
    productNames: ["Sisley Black Rose Eye Contour Fluid 14ml", "Sisley Black Rose Skin Infusion Cream 50ml"],
  },
  {
    id: "bundle-skinceuticals-aging",
    name: "SkinCeuticals Anti-Aging Power",
    tagline: "Clinical results at home",
    discount: "21% OFF",
    originalPrice: "$170.00",
    bundlePrice: "$135.00",
    savings: "$35.00",
    productSkus: ["SC-AGE-ADV-48", "SC-PTIOX-30"],
    productNames: ["SkinCeuticals A.G.E. Interrupter Advanced 48ml", "SkinCeuticals P-TIOX Peptide Serum 30ml"],
  },
  {
    id: "bundle-spf-duo",
    name: "SPF Duo - Matte & Dewy",
    tagline: "Your finish, your choice",
    discount: "19% OFF",
    originalPrice: "$68.00",
    bundlePrice: "$55.00",
    savings: "$13.00",
    productSkus: ["BRB-001", "BRB-002"],
    productNames: ["BARUBT Matte Universal Tinted Moisturizer SPF 46", "BARUBT Dewy Universal Tinted Moisturizer SPF 46"],
  },
  {
    id: "bundle-sf-lip-trio",
    name: "Summer Fridays Lip Trio",
    tagline: "Three shades, endless vibes",
    discount: "19% OFF",
    originalPrice: "$42.00",
    bundlePrice: "$34.00",
    savings: "$8.00",
    productSkus: ["SF-LBB-VANBEIGE", "SF-LBB-PINKSUGAR", "SF-LBB-ICEDCOFFEE"],
    productNames: ["Summer Fridays Lip Butter Balm - Vanilla Beige", "Summer Fridays Lip Butter Balm - Pink Sugar", "Summer Fridays Lip Butter Balm - Iced Coffee"],
  },
  {
    id: "bundle-sun-shield",
    name: "Sun & Skin Shield",
    tagline: "Protect, calm, repeat",
    discount: "20% OFF",
    originalPrice: "$70.00",
    bundlePrice: "$56.00",
    savings: "$14.00",
    productSkus: ["RKA-020", "ELTA-004"],
    productNames: ["Dermagarden Clear Cream 50g", "EltaMD UV Clear Broad-Spectrum SPF 46"],
  },
];

/**
 * Given a list of recommended product SKUs, find matching bundle deals.
 */
/** @deprecated Use buildProductCatalogText instead */
export const getProductCatalogText = buildProductCatalogText;

/** Get total product count across all categories */
export function getProductCount(): number {
  return PRODUCT_CATALOG.reduce((sum, cat) => sum + cat.products.length, 0);
}

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
