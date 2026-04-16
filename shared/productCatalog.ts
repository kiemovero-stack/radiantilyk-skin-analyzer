/**
 * Complete skincare product catalog from RadiantilyK Aesthetic storefront.
 * 
 * This data is used by the AI analysis engine to recommend only
 * skincare products that the clinic actually sells. Each product
 * includes SKU, name, price, category, and description.
 * 
 * Last synced with https://rkaskin.co — April 2026 — 76 products, 5 bundle deals
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

const STORE_URL = "https://rkaskin.co";

export const PRODUCT_CATALOG: ProductCategory[] = [
  {
    category: "Cleansers & Toners",
    products: [
      {
        sku: "RKA-011",
        name: "Hyaluronic Acid Cleanser 60g",
        price: "$8.00",
        category: "Cleanser",
        description: "Gentle hyaluronic acid cleanser that refreshes and deeply hydrates while cleansing.",
        keyBenefits: ["hydration", "gentle cleansing", "hyaluronic acid"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-012",
        name: "Nicotinamide Cleanser 60g",
        price: "$8.00",
        category: "Cleanser",
        description: "Nicotinamide-infused cleanser that purifies pores and improves skin clarity.",
        keyBenefits: ["pore purifying", "niacinamide", "skin clarity", "oil control"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-PHYTO-TONER-200",
        name: "SkinCeuticals Phyto Corrective Toner 200ml",
        price: "$38.00",
        category: "Cleanser",
        description: "Hydrating toner that instantly soothes and strengthens the epidermal barrier. Formulated with botanical extracts to calm sensitive, redness-prone skin.",
        keyBenefits: ["soothing", "barrier repair", "redness reduction", "botanical extracts", "sensitive skin"],
        shopUrl: STORE_URL,
      },
      {
        sku: "ZO-RENEW-PADS-60",
        name: "ZO Skin Health Complexion Renewal Pads 60ct",
        price: "$36.00",
        category: "Cleanser",
        description: "Exfoliating pads that remove excess oil and pore-clogging debris. 100% plant-based formula with glycolic and salicylic acid for clearer, smoother skin.",
        keyBenefits: ["exfoliation", "glycolic acid", "salicylic acid", "oil control", "pore clearing"],
        shopUrl: STORE_URL,
      },
    ],
  },
  {
    category: "Creams & Moisturizers",
    products: [
      {
        sku: "CARV-HA9-50",
        name: "Carvenchy Hyaluronic Acid 9 Cream 50ml",
        price: "$18.00",
        category: "Cream",
        description: "Korean moisturizing boost formula packed with 9 types of Hyaluronic Acid and Vitamin B5. Delivers deep, lasting hydration with a non-sticky, refreshing finish for plump, dewy skin.",
        keyBenefits: ["9 types hyaluronic acid", "vitamin B5", "deep hydration", "K-beauty", "dewy skin"],
        shopUrl: STORE_URL,
      },
      {
        sku: "CARV-PDRN-50",
        name: "Carvenchy PDRN Collagen Jelly Cream 50ml",
        price: "$18.00",
        category: "Cream",
        description: "Advanced Korean skincare cream with 7 Collagen Complex and PDRN-infused formula. Enhances skin firmness, promotes rejuvenation, and provides deep hydration for a plump, lifted appearance.",
        keyBenefits: ["PDRN", "7 collagen complex", "firming", "rejuvenation", "K-beauty", "lifting"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-020",
        name: "Dermagarden Clear Cream 50g",
        price: "$32.00",
        category: "Cream",
        description: "Soothing clear cream that calms irritation and strengthens the skin barrier.",
        keyBenefits: ["soothing", "barrier repair", "anti-irritation", "calming"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-029",
        name: "Dermagarden Peptide-7 Cream 60g",
        price: "$38.00",
        category: "Cream",
        description: "Peptide-7 cream with seven active peptides for comprehensive anti-aging benefits.",
        keyBenefits: ["anti-aging", "peptides", "firming", "wrinkle reduction", "collagen support"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-021",
        name: "Dermagarden Vita C Cream 50g",
        price: "$32.00",
        category: "Cream",
        description: "Vitamin C-enriched cream that brightens and protects skin from oxidative stress.",
        keyBenefits: ["vitamin C", "brightening", "antioxidant", "oxidative protection"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-023",
        name: "EPTQ By.derm Intensive Cream 3.53 oz",
        price: "$36.00",
        category: "Cream",
        description: "Intensive moisturizing cream with peptides for deep hydration and skin repair.",
        keyBenefits: ["deep hydration", "peptides", "skin repair", "intensive moisturizing"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-024",
        name: "Generic Tone-Up Face Cream",
        price: "$12.00",
        category: "Cream",
        description: "Tone-up face cream that instantly brightens and evens out skin appearance.",
        keyBenefits: ["tone-up", "brightening", "even skin tone", "affordable"],
        shopUrl: STORE_URL,
      },
      {
        sku: "GLUT-CREAM-30",
        name: "Glutathione Whitening Cream 30g",
        price: "$18.00",
        category: "Cream",
        description: "Brightening cream formulated with 5% Glutathione, Nicotinamide, and Hyaluronic Acid. Targets dark spots, shrinks pores, and promotes a radiant, even-toned complexion. Suitable for all skin types.",
        keyBenefits: ["glutathione", "nicotinamide", "hyaluronic acid", "dark spots", "pore minimizing", "brightening"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-019",
        name: "Inspira Med Fair Complexion Cream 50ml",
        price: "$48.00",
        category: "Cream",
        description: "Brightening cream that evens skin tone and reduces dark spots for a fair complexion.",
        keyBenefits: ["brightening", "dark spot reduction", "even skin tone", "hyperpigmentation"],
        shopUrl: STORE_URL,
      },
      {
        sku: "KIEHLS-ULTRA-FC-50",
        name: "Kiehl's Ultra Facial Cream 50ml",
        price: "$24.00",
        category: "Cream",
        description: "Bestselling 24-hour daily moisturizer with Squalane and Glacial Glycoprotein for up to 72-hour hydration. Lightweight, non-greasy formula for all skin types.",
        keyBenefits: ["24-hour hydration", "squalane", "lightweight", "all skin types", "non-greasy"],
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-001",
        name: "MOV Radiance Renewal Night Moisturizer",
        price: "$48.00",
        category: "Cream",
        description: "Renewing overnight moisturizer with microencapsulated vegan retinol, tranexamic acid, EGF, PDRN, and plant-derived exosomes for smoother, more refined skin.",
        keyBenefits: ["retinol", "EGF", "PDRN", "exosomes", "tranexamic acid", "overnight renewal", "anti-aging"],
        shopUrl: STORE_URL,
      },
      {
        sku: "NEUT-RC-95",
        name: "Neutralyze Renewal Complex 95ml",
        price: "$22.00",
        category: "Cream",
        description: "Blemish control and anti-aging moisturizer with time-released AHA/BHA complex. Combines Salicylic Acid and Mandelic Acid to keep skin exfoliated, hydrated, and acne-free while fighting signs of aging.",
        keyBenefits: ["AHA/BHA", "salicylic acid", "mandelic acid", "blemish control", "anti-aging", "exfoliating"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-009",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 100ml",
        price: "$38.00",
        category: "Cream",
        description: "Antioxidant-rich vitamin C moisturizer for deep hydration and radiance. Full size 100ml.",
        keyBenefits: ["vitamin C", "antioxidant", "hydration", "radiance", "full size"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-008",
        name: "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 50ml",
        price: "$24.00",
        category: "Cream",
        description: "Brightening vitamin C moisturizer that hydrates and evens skin tone. Travel size 50ml.",
        keyBenefits: ["vitamin C", "brightening", "hydration", "travel size"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-GHKCU-30",
        name: "RadiantilyK GHK-Cu Copper Peptides Face Cream 30g",
        price: "$38.00",
        category: "Cream",
        description: "Our signature firming and repairing face cream powered by GHK-Cu copper peptides. Visibly tightens, firms, and repairs skin while fighting signs of aging.",
        keyBenefits: ["copper peptides", "GHK-Cu", "firming", "repairing", "anti-aging", "tightening"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SIS-BR-CREAM-50",
        name: "Sisley Black Rose Skin Infusion Cream 50ml",
        price: "$115.00",
        category: "Cream",
        description: "Daily radiant plumping face cream with Black Rose extract. Restores elasticity, reinforces luminosity, and intensely moisturizes for a youthful, glowing complexion.",
        keyBenefits: ["luxury", "plumping", "Black Rose", "elasticity", "luminosity", "intense hydration"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-022",
        name: "Skin Accents Wonder Glow Night Cream 50ml",
        price: "$26.00",
        category: "Cream",
        description: "Overnight glow cream that repairs and rejuvenates skin while you sleep.",
        keyBenefits: ["overnight repair", "glow", "rejuvenation", "night cream"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-AGE-ADV-48",
        name: "SkinCeuticals A.G.E. Interrupter Advanced 48ml",
        price: "$88.00",
        category: "Cream",
        description: "Award-winning anti-wrinkle cream that corrects and defends against visible signs of aging. Clinically proven to improve wrinkles in five key facial zones.",
        keyBenefits: ["anti-wrinkle", "clinical grade", "A.G.E. technology", "advanced anti-aging"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-PHYTO-A-30",
        name: "SkinCeuticals Phyto A+ Brightening Treatment 30ml",
        price: "$58.00",
        category: "Cream",
        description: "Oil-free brightening moisturizer with 3% Azelaic Acid and 2% Arbutin. Clinically proven to improve skin tone clarity, radiance, and texture.",
        keyBenefits: ["azelaic acid", "arbutin", "brightening", "oil-free", "redness", "sensitive skin", "texture"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-025",
        name: "Waterfully GHK-Cu Copper Peptide Face Cream",
        price: "$22.00",
        category: "Cream",
        description: "Copper peptide face cream that boosts collagen production and firms aging skin.",
        keyBenefits: ["copper peptides", "collagen boost", "firming", "anti-aging", "affordable"],
        shopUrl: STORE_URL,
      },
    ],
  },
  {
    category: "Eye Care",
    products: [
      {
        sku: "BIOQ-LASH-7",
        name: "BIOAQUA Eyelash Growth Essence 7ml",
        price: "$16.00",
        category: "Eye Care",
        description: "Nourish and grow longer, fuller lashes with this gentle eyelash growth essence. Strengthens and lengthens lashes for a naturally beautiful, voluminous look.",
        keyBenefits: ["lash growth", "strengthening", "lengthening", "gentle", "voluminous lashes"],
        shopUrl: STORE_URL,
      },
      {
        sku: "CLAR-DS-EYE-20",
        name: "Clarins Double Serum Eye 20ml",
        price: "$42.00",
        category: "Eye Care",
        description: "Dual-phase eye concentrate with 13 plant extracts that addresses all visible signs of aging around the eyes. Smooths, firms, and brightens the eye area.",
        keyBenefits: ["eye serum", "dual-phase", "13 plant extracts", "anti-aging", "firming", "brightening"],
        shopUrl: STORE_URL,
      },
      {
        sku: "KIEHLS-EYE-AVO-14",
        name: "Kiehl's Creamy Eye Treatment with Avocado 14ml",
        price: "$20.00",
        category: "Eye Care",
        description: "Rich, creamy under-eye treatment with Avocado Oil that moisturizes and nourishes the delicate eye area. Ophthalmologist and dermatologist tested.",
        keyBenefits: ["under-eye care", "avocado oil", "moisturizing", "nourishing", "gentle"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SIS-BR-EYE-14",
        name: "Sisley Black Rose Eye Contour Fluid 14ml",
        price: "$85.00",
        category: "Eye Care",
        description: "Luxury eye treatment that smooths, revitalizes, and illuminates the delicate eye area. Enriched with Black Rose extract for anti-aging benefits.",
        keyBenefits: ["luxury", "eye treatment", "Black Rose", "anti-aging", "illuminating", "smoothing"],
        shopUrl: STORE_URL,
      },
      {
        sku: "VIAR-EYE-15",
        name: "Viareline Advanced Eye Repair Serum 15ml",
        price: "$24.00",
        category: "Eye Care",
        description: "Advanced eye repair serum with Caffeine, Retinol, Peptides, Hyaluronic Acid, and Niacinamide. Roller ball applicator helps reduce dark circles, puffiness, and fine lines.",
        keyBenefits: ["caffeine", "retinol", "peptides", "dark circles", "puffiness", "fine lines", "roller ball"],
        shopUrl: STORE_URL,
      },
    ],
  },
  {
    category: "Lip Care",
    products: [
      {
        sku: "GEL-INK-LIP-10",
        name: "Gel Inkeratin Peptide Lip Treatment 10ml",
        price: "$14.00",
        category: "Lip Bar",
        description: "A clear gel peptide lip treatment that deeply moisturizes and restores dry, cracked lips. Leaves lips visibly plumper, softer, and beautifully glossy.",
        keyBenefits: ["peptide", "lip treatment", "moisturizing", "plumping", "glossy", "clear gel"],
        shopUrl: STORE_URL,
      },
      {
        sku: "PEP-LIP-PASSION",
        name: "Peptide Mineral Lip Treatment Gel - Passion Fruit 10ml",
        price: "$14.00",
        category: "Lip Bar",
        description: "A tropical peptide lip treatment gel with sweet passion fruit scent. Nourishes, plumps, and leaves lips irresistibly glossy and hydrated.",
        keyBenefits: ["peptide", "lip treatment", "passion fruit", "plumping", "glossy", "hydrating"],
        shopUrl: STORE_URL,
      },
      {
        sku: "PEP-LIP-CARAMEL",
        name: "Peptide Mineral Lip Treatment Gel - Salted Caramel 10ml",
        price: "$14.00",
        category: "Lip Bar",
        description: "A nourishing peptide lip treatment gel with indulgent salted caramel scent. Hydrates, plumps, and delivers a glossy, pillowy-soft finish.",
        keyBenefits: ["peptide", "lip treatment", "salted caramel", "plumping", "glossy", "nourishing"],
        shopUrl: STORE_URL,
      },
      {
        sku: "PEP-LIP-UNSCENT",
        name: "Peptide Mineral Lip Treatment Gel - Unscented 10ml",
        price: "$14.00",
        category: "Lip Bar",
        description: "A fragrance-free peptide lip treatment gel for sensitive lips. Delivers deep hydration and visible plumping with a clean, clear formula.",
        keyBenefits: ["peptide", "lip treatment", "fragrance-free", "sensitive", "plumping", "hydrating"],
        shopUrl: STORE_URL,
      },
      {
        sku: "PEP-LIP-WATERMELON",
        name: "Peptide Mineral Lip Treatment Gel - Watermelon 10ml",
        price: "$14.00",
        category: "Lip Bar",
        description: "A restorative peptide lip treatment gel with refreshing watermelon scent. Plumps, moisturizes, and leaves lips looking glossy and naturally full.",
        keyBenefits: ["peptide", "lip treatment", "watermelon", "plumping", "glossy", "restorative"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-BROWNSUGAR",
        name: "Summer Fridays Lip Butter Balm - Brown Sugar",
        price: "$14.00",
        category: "Lip Bar",
        description: "Deep brown-tinted vegan lip balm with a warm, caramel-inspired shade. Nourishes lips while delivering a rich, sophisticated color.",
        keyBenefits: ["lip care", "tinted", "vegan", "nourishing", "brown sugar shade"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-ICEDCOFFEE",
        name: "Summer Fridays Lip Butter Balm - Iced Coffee",
        price: "$14.00",
        category: "Lip Bar",
        description: "Rich brown-tinted vegan lip balm with a coffee-inspired shade. Moisturizes and adds a warm, neutral tint for an effortless everyday look.",
        keyBenefits: ["lip care", "tinted", "vegan", "moisturizing", "iced coffee shade"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-PINKSUGAR",
        name: "Summer Fridays Lip Butter Balm - Pink Sugar",
        price: "$14.00",
        category: "Lip Bar",
        description: "Tinted vegan lip balm in a sweet pink shade with a sugary scent. Delivers hydration, nourishment, and a pop of rosy color.",
        keyBenefits: ["lip care", "tinted", "vegan", "hydrating", "pink sugar shade"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-TOASTMRSH",
        name: "Summer Fridays Lip Butter Balm - Toasted Marshmallow",
        price: "$14.00",
        category: "Lip Bar",
        description: "Shimmery nude vegan lip balm with a touch of golden shimmer and toasted marshmallow sweetness. Limited edition fan favorite.",
        keyBenefits: ["lip care", "shimmer", "vegan", "limited edition", "toasted marshmallow"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-VANILLA",
        name: "Summer Fridays Lip Butter Balm - Vanilla",
        price: "$14.00",
        category: "Lip Bar",
        description: "The original bestselling vegan lip balm that conditions and softens dry lips with a sweet vanilla flavor. Instant moisture and shine.",
        keyBenefits: ["lip care", "bestseller", "vegan", "vanilla", "conditioning", "moisture"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SF-LBB-VANBEIGE",
        name: "Summer Fridays Lip Butter Balm - Vanilla Beige",
        price: "$14.00",
        category: "Lip Bar",
        description: "Silky vegan lip balm with a sheer beige tint and hint of vanilla. Hydrates and soothes parched lips instantly with a buttery, glossy finish.",
        keyBenefits: ["lip care", "sheer tint", "vegan", "vanilla beige", "glossy", "hydrating"],
        shopUrl: STORE_URL,
      },
    ],
  },
  {
    category: "Post-Procedure",
    products: [
      {
        sku: "CARV-SCAR-50",
        name: "Carvenchy Silicone Scar Cream 50ml",
        price: "$14.00",
        category: "Post-Procedure",
        description: "Professional-grade silicone scar therapy cream that repairs and reduces all types of scars. Waterproof, breathable, non-greasy, and fragrance-free with 24-hour efficacy for post-procedure recovery.",
        keyBenefits: ["silicone", "scar therapy", "waterproof", "breathable", "post-procedure", "fragrance-free"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-005",
        name: "Cosmedix Post Treatment 4-Piece Essentials Kit",
        price: "$38.00",
        category: "Post-Procedure",
        description: "Four-piece post-procedure essentials to soothe, hydrate, and protect healing skin.",
        keyBenefits: ["post-procedure", "soothing", "healing", "hydration", "protection"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-006",
        name: "FactorFive 7 Day Post Treatment Kit",
        price: "$58.00",
        category: "Post-Procedure",
        description: "7-day post-treatment recovery kit with growth factors to accelerate skin healing.",
        keyBenefits: ["growth factors", "post-procedure", "7-day recovery", "accelerated healing"],
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-004-1OZ",
        name: "MOV Cellular Repair Mist 1 oz",
        price: "$22.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Travel-friendly size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "soothing", "travel size"],
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-004-1.69OZ",
        name: "MOV Cellular Repair Mist 1.69 oz",
        price: "$34.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Standard size.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "soothing", "standard size"],
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-004-3.4OZ",
        name: "MOV Cellular Repair Mist 3.4 oz",
        price: "$52.00",
        category: "Post-Procedure",
        description: "Soothing regenerative facial mist with exosomes, PDRN, growth factors, and peptides to support skin recovery, deliver deep hydration, and calm visible redness. Full-size bottle.",
        keyBenefits: ["exosomes", "PDRN", "growth factors", "peptides", "soothing", "full size"],
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
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-026",
        name: "AIXIN Beauty Recovering Aging Wrinkle Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Anti-wrinkle serum that targets fine lines and restores youthful skin elasticity.",
        keyBenefits: ["anti-wrinkle", "fine lines", "elasticity", "affordable"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-027",
        name: "AIXIN Beauty Scar & Mark Removing Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Scar and mark removing serum that fades blemishes and promotes smooth skin texture.",
        keyBenefits: ["scar fading", "mark removal", "smooth texture", "blemish reduction", "affordable"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-031",
        name: "AIXIN Beauty Vitamin B12 Whitening Serum 30ml",
        price: "$16.00",
        category: "Serum",
        description: "Vitamin B12 whitening serum that brightens and nourishes for a radiant complexion.",
        keyBenefits: ["vitamin B12", "brightening", "nourishing", "radiance", "affordable"],
        shopUrl: STORE_URL,
      },
      {
        sku: "CARV-4IN1-30",
        name: "Carvenchy 4-in-1 Facial Serum 30ml",
        price: "$14.00",
        category: "Serum",
        description: "Powerful age-defense serum combining 10% Hyaluronic Acid, 5% Nicotinamide, 30% Vitamin C, and 10% Vitamin E. Targets wrinkles, dark circles, and uneven skin tone.",
        keyBenefits: ["hyaluronic acid", "nicotinamide", "vitamin C", "vitamin E", "anti-aging", "brightening", "affordable"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-014",
        name: "Dermagarden Glutathione Serum 60ml",
        price: "$35.00",
        category: "Serum",
        description: "Glutathione antioxidant serum for skin brightening and protection against free radicals.",
        keyBenefits: ["glutathione", "antioxidant", "brightening", "free radical protection"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-017",
        name: "Desembre A+ Aging Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Anti-aging serum with advanced peptides to reduce wrinkles and restore firmness.",
        keyBenefits: ["anti-aging", "peptides", "wrinkle reduction", "firmness"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-018",
        name: "Desembre P+ Pure Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Purifying science serum that detoxifies and balances skin for a clear, healthy glow.",
        keyBenefits: ["purifying", "detoxifying", "balancing", "clear skin"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-015",
        name: "Desembre Serum Corrective 100ml",
        price: "$42.00",
        category: "Serum",
        description: "Corrective serum that targets fine lines, uneven texture, and dullness. Large 100ml size.",
        keyBenefits: ["corrective", "fine lines", "texture", "dullness", "large size"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-016",
        name: "Desembre W+ White Science Serum",
        price: "$32.00",
        category: "Serum",
        description: "Whitening science serum that reduces hyperpigmentation for a luminous complexion.",
        keyBenefits: ["whitening", "hyperpigmentation", "luminous", "brightening"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-013",
        name: "Inspira Med Fair Complexion Serum 30ml",
        price: "$52.00",
        category: "Serum",
        description: "Brightening serum with fair complexion actives to reduce dark spots and uneven tone.",
        keyBenefits: ["brightening", "dark spots", "even tone", "fair complexion"],
        shopUrl: STORE_URL,
      },
      {
        sku: "KIEHLS-VITC-50",
        name: "Kiehl's Powerful-Strength Vitamin C Serum 50ml",
        price: "$42.00",
        category: "Serum",
        description: "Potent 12.5% Vitamin C serum with Hyaluronic Acid that visibly reduces fine lines and brightens skin in just 2 weeks. Paraben-free and alcohol-free.",
        keyBenefits: ["12.5% vitamin C", "hyaluronic acid", "fine lines", "brightening", "paraben-free"],
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-007",
        name: "MOV Cellular Silk Advanced Renewal Serum",
        price: "$52.00",
        category: "Serum",
        description: "Advanced dermal renewal serum featuring retinol (Vitamin A), 2% bakuchiol, PDRN, and plant-derived exosomes to visibly refine skin texture and support elasticity.",
        keyBenefits: ["retinol", "bakuchiol", "PDRN", "exosomes", "texture refinement", "elasticity"],
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-003",
        name: "MOV Lash Regenerative Serum",
        price: "$32.00",
        category: "Serum",
        description: "Peptide-based lash conditioning formula with hydrolyzed keratin, panthenol, EGF, and botanical extracts to strengthen, condition, and support healthier-looking lashes.",
        keyBenefits: ["lash growth", "peptides", "keratin", "EGF", "conditioning"],
        shopUrl: STORE_URL,
      },
      {
        sku: "MOV-002",
        name: "MOV Mandelic Refining Serum",
        price: "$42.00",
        category: "Serum",
        description: "Advanced skin renewal serum combining exfoliating mandelic and lactic acids with PDRN, EGF, copper peptide, bakuchiol, and tranexamic acid to refine texture and brighten tone.",
        keyBenefits: ["mandelic acid", "lactic acid", "PDRN", "EGF", "copper peptide", "exfoliating", "brightening"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-030",
        name: "RadiantilyK Aesthetic Vitamin C Facial Serum 1oz",
        price: "$28.00",
        category: "Serum",
        description: "Potent vitamin C facial serum for brightening, firming, and antioxidant protection.",
        keyBenefits: ["vitamin C", "brightening", "firming", "antioxidant"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-033",
        name: "RadiantilyK Resurfacing Serum",
        price: "$38.00",
        category: "Serum",
        description: "Advanced multi-peptide brightening serum with PDRN, EGF, exosomes, and niacinamide that hydrates, refines texture, improves tone, and supports collagen.",
        keyBenefits: ["PDRN", "EGF", "exosomes", "niacinamide", "resurfacing", "collagen support", "brightening"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SC-PTIOX-30",
        name: "SkinCeuticals P-TIOX Peptide Serum 30ml",
        price: "$82.00",
        category: "Serum",
        description: "Wrinkle-modulating peptide serum inspired by anti-wrinkle neurotoxin effects. Reduces the appearance of 9 types of expression lines for glass-skin radiance.",
        keyBenefits: ["peptide", "wrinkle modulating", "expression lines", "glass skin", "clinical grade"],
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
        shopUrl: STORE_URL,
      },
      {
        sku: "BRB-001",
        name: "BARUBT Matte Universal Tinted Moisturizer SPF 46",
        price: "$34.00",
        category: "Sunscreen",
        description: "A lightweight, all-in-one tinted moisturizer that delivers a smooth matte finish with SPF 46 broad-spectrum UVA/UVB protection. Controls shine and minimizes pores.",
        keyBenefits: ["SPF 46", "matte finish", "tinted", "universal shade", "oil control", "pore minimizing"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-007",
        name: "EELHOE Sun Cream SPF90 40g",
        price: "$20.00",
        category: "Sunscreen",
        description: "High SPF90 sun cream providing strong UV protection for daily outdoor exposure.",
        keyBenefits: ["SPF 90", "high protection", "UV shield", "outdoor", "affordable"],
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-002",
        name: "EltaMD UV AOX Elements Tinted Broad-Spectrum SPF 50",
        price: "$39.00",
        category: "Sunscreen",
        description: "Tinted mineral sunscreen with SPF 50 broad-spectrum protection. Features antioxidant-rich formula with transparent zinc oxide for all skin types.",
        keyBenefits: ["SPF 50", "mineral", "tinted", "antioxidant", "zinc oxide", "all skin types"],
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-004",
        name: "EltaMD UV Clear Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Untinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea. Oil-free.",
        keyBenefits: ["SPF 46", "niacinamide", "zinc oxide", "acne-safe", "rosacea-safe", "oil-free"],
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-003",
        name: "EltaMD UV Clear Tinted Broad-Spectrum SPF 46",
        price: "$38.00",
        category: "Sunscreen",
        description: "Tinted face sunscreen with SPF 46 broad-spectrum protection. Contains niacinamide and transparent zinc oxide to calm and protect skin prone to acne and rosacea.",
        keyBenefits: ["SPF 46", "tinted", "niacinamide", "zinc oxide", "acne-safe", "rosacea-safe"],
        shopUrl: STORE_URL,
      },
      {
        sku: "ELTA-001",
        name: "EltaMD UV Daily Tinted Broad-Spectrum SPF 40",
        price: "$36.00",
        category: "Sunscreen",
        description: "Lightweight tinted daily sunscreen with SPF 40 broad-spectrum UVA/UVB protection. Formulated with hyaluronic acid and transparent zinc oxide for a moisture boost.",
        keyBenefits: ["SPF 40", "tinted", "hyaluronic acid", "zinc oxide", "daily wear", "lightweight"],
        shopUrl: STORE_URL,
      },
      {
        sku: "SREM-ROSEGOLD-SPF45",
        name: "S·Remove Rose Gold Sun Shield SPF 45 100ml",
        price: "$28.00",
        category: "Sunscreen",
        description: "Luxurious body glow sunscreen with rose gold pearlescent minerals and broad spectrum SPF 45 protection. UVA, UVB, and PABA-free formula gives skin a radiant, sun-kissed glow.",
        keyBenefits: ["SPF 45", "rose gold", "body glow", "pearlescent", "UVA/UVB", "PABA-free"],
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
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-001",
        name: "IMAGE Skincare Peel Protect Repeat Post-Treatment Trial Kit",
        price: "$28.00",
        category: "Trial Kit",
        description: "Post-treatment recovery kit with soothing essentials to calm and protect freshly treated skin.",
        keyBenefits: ["post-treatment", "soothing", "calming", "protection", "trial size"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-004",
        name: "Indie Lee Skincare Set",
        price: "$26.00",
        category: "Trial Kit",
        description: "Clean beauty skincare set with natural botanicals for a fresh, radiant complexion.",
        keyBenefits: ["clean beauty", "natural", "botanicals", "radiance", "trial set"],
        shopUrl: STORE_URL,
      },
      {
        sku: "RKA-002",
        name: "iS Clinical Pure Calm Trial Kit",
        price: "$48.00",
        category: "Trial Kit",
        description: "Gentle trial kit designed for sensitive, reactive skin prone to redness and irritation.",
        keyBenefits: ["sensitive skin", "calming", "reactive skin", "redness", "clinical grade"],
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
  let text = "=== SKINCARE PRODUCT CATALOG (RadiantilyK Aesthetic — rkaskin.co) ===\n";
  text += "76 products available. Recommend 5-7 products per client based on their specific concerns.\n";
  text += "ALWAYS include a sunscreen recommendation for every client.\n";
  text += "ALWAYS recommend a post-procedure product when recommending any in-office procedure.\n";
  text += "ALL product links should point to https://rkaskin.co\n\n";

  text += "PRODUCT RECOMMENDATION GUIDELINES:\n";
  text += "- For ACNE / OILY SKIN: EltaMD UV Clear SPF 46 (niacinamide), MOV Mandelic Refining Serum, Desembre P+ Pure Science Serum, Nicotinamide Cleanser, ZO Skin Health Complexion Renewal Pads, Neutralyze Renewal Complex\n";
  text += "- For AGING / WRINKLES: MOV Radiance Renewal Night Moisturizer (retinol+EGF), Dermagarden Peptide-7 Cream, MOV Cellular Silk Advanced Renewal Serum, SkinCeuticals A.G.E. Interrupter Advanced, SkinCeuticals P-TIOX Peptide Serum, AIXIN Beauty Recovering Aging Wrinkle Serum, Carvenchy PDRN Collagen Jelly Cream\n";
  text += "- For HYPERPIGMENTATION / DARK SPOTS: Inspira Med Fair Complexion Serum, Desembre W+ White Science Serum, SkinCeuticals Phyto A+ Brightening Treatment, RadiantilyK Resurfacing Serum, AIXIN Beauty Vitamin B12 Whitening Serum, Dermagarden Glutathione Serum, Glutathione Whitening Cream\n";
  text += "- For DRYNESS / DEHYDRATION: Sisley Black Rose Skin Infusion Cream, EPTQ By.derm Intensive Cream, Kiehl's Ultra Facial Cream, RadiantilyK Vitamin C Moisturizer, BARUBT Dewy Tinted Moisturizer SPF 46, Carvenchy Hyaluronic Acid 9 Cream\n";
  text += "- For SENSITIVE / REDNESS / ROSACEA: SkinCeuticals Phyto Corrective Toner, SkinCeuticals Phyto A+ Brightening Treatment, Dermagarden Clear Cream, EltaMD UV Clear SPF 46, Dermalogica Sensitive Skin Rescue Kit, iS Clinical Pure Calm Trial Kit\n";
  text += "- For POST-PROCEDURE RECOVERY: MOV Cellular Repair Mist (1oz/1.69oz/3.4oz), FactorFive 7 Day Post Treatment Kit, Cosmedix Post Treatment Kit, IMAGE Skincare Post-Treatment Trial Kit, Carvenchy Silicone Scar Cream\n";
  text += "- For TEXTURE / DULLNESS: MOV Mandelic Refining Serum, Desembre Serum Corrective, RadiantilyK Resurfacing Serum, ZO Skin Health Complexion Renewal Pads\n";
  text += "- For UNDER-EYE CONCERNS: Sisley Black Rose Eye Contour Fluid, Kiehl's Creamy Eye Treatment with Avocado, Clarins Double Serum Eye, Viareline Advanced Eye Repair Serum\n";
  text += "- For SCARS / MARKS: AIXIN Beauty Scar & Mark Removing Serum, RadiantilyK Resurfacing Serum, AIXIN Beauty EGF Revitalizing Serum, Carvenchy Silicone Scar Cream\n";
  text += "- For LASH ENHANCEMENT: MOV Lash Regenerative Serum, BIOAQUA Eyelash Growth Essence\n";
  text += "- For FIRMING / COLLAGEN: RadiantilyK GHK-Cu Copper Peptides Face Cream, Waterfully GHK-Cu Copper Peptide Face Cream, Carvenchy PDRN Collagen Jelly Cream\n";
  text += "- For BRIGHTENING / VITAMIN C: Kiehl's Powerful-Strength Vitamin C Serum, RadiantilyK Vitamin C Facial Serum, RadiantilyK Vitamin C Facial Moisturizer, Dermagarden Vita C Cream, Carvenchy 4-in-1 Facial Serum\n";
  text += "- For LIP CARE: Gel Inkeratin Peptide Lip Treatment, Peptide Mineral Lip Treatment Gel (Passion Fruit, Salted Caramel, Unscented, Watermelon), Summer Fridays Lip Butter Balm (Vanilla, Pink Sugar, Iced Coffee, Brown Sugar, Vanilla Beige, Toasted Marshmallow)\n";
  text += "- For SUN PROTECTION: EltaMD UV Clear SPF 46 (acne/rosacea), EltaMD UV Clear Tinted SPF 46, EltaMD UV AOX Elements SPF 50 (all skin), EltaMD UV Daily Tinted SPF 40, BARUBT Matte SPF 46 (oily), BARUBT Dewy SPF 46 (dry), EELHOE Sun Cream SPF90, S·Remove Rose Gold Sun Shield SPF 45\n";
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

  text += "\n=== BUNDLE DEALS (from rkaskin.co) ===\n";
  text += "When recommending multiple products that match a bundle, ALWAYS suggest the bundle deal instead to save the client money.\n\n";
  for (const bundle of BUNDLE_DEALS) {
    text += `  🎁 ${bundle.name} — ${bundle.bundlePrice} (was ${bundle.originalPrice}, save ${bundle.savings})\n`;
    text += `     ${bundle.tagline}\n`;
    text += `     Includes: ${bundle.productNames.join(" + ")}\n\n`;
  }
  text += "=== END OF PRODUCT CATALOG ===\n";
  return text;
}

/** Bundle deals from rkaskin.co storefront */
export const BUNDLE_DEALS: BundleDeal[] = [
  {
    id: "bundle-complete-glow",
    name: "Complete Glow Routine",
    tagline: "Your Daily Glow Essentials",
    discount: "21% OFF",
    originalPrice: "$112.00",
    bundlePrice: "$89.00",
    savings: "$23.00",
    productSkus: ["RKA-011", "RKA-008", "RKA-030", "ELTA-004", "SF-LBB-VANBEIGE"],
    productNames: ["Hyaluronic Acid Cleanser 60g", "RadiantilyK Aesthetic Vitamin C Facial Moisturizer 50ml", "RadiantilyK Aesthetic Vitamin C Facial Serum 1oz", "EltaMD UV Clear Broad-Spectrum SPF 46", "Summer Fridays Lip Butter Balm - Vanilla Beige"],
  },
  {
    id: "bundle-kbeauty-brightening",
    name: "K-Beauty Brightening Set",
    tagline: "Glow From Within",
    discount: "23% OFF",
    originalPrice: "$115.00",
    bundlePrice: "$89.00",
    savings: "$26.00",
    productSkus: ["RKA-014", "RKA-031", "GLUT-CREAM-30", "CARV-HA9-50", "SREM-ROSEGOLD-SPF45"],
    productNames: ["Dermagarden Glutathione Serum 60ml", "AIXIN Beauty Vitamin B12 Whitening Serum 30ml", "Glutathione Whitening Cream 30g", "Carvenchy Hyaluronic Acid 9 Cream 50ml", "S·Remove Rose Gold Sun Shield SPF 45 100ml"],
  },
  {
    id: "bundle-lip-obsession",
    name: "Lip Obsession Collection",
    tagline: "Kiss-Ready Lips, Always",
    discount: "21% OFF",
    originalPrice: "$70.00",
    bundlePrice: "$55.00",
    savings: "$15.00",
    productSkus: ["SF-LBB-ICEDCOFFEE", "SF-LBB-BROWNSUGAR", "PEP-LIP-WATERMELON", "PEP-LIP-CARAMEL", "GEL-INK-LIP-10"],
    productNames: ["Summer Fridays Lip Butter Balm - Iced Coffee", "Summer Fridays Lip Butter Balm - Brown Sugar", "Peptide Mineral Lip Treatment Gel - Watermelon 10ml", "Peptide Mineral Lip Treatment Gel - Salted Caramel 10ml", "Gel Inkeratin Peptide Lip Treatment 10ml"],
  },
  {
    id: "bundle-luxury-antiaging",
    name: "Luxury Anti-Aging Collection",
    tagline: "Premium Age-Defying Essentials",
    discount: "20% OFF",
    originalPrice: "$156.00",
    bundlePrice: "$125.00",
    savings: "$31.00",
    productSkus: ["BRB-002", "KIEHLS-ULTRA-FC-50", "KIEHLS-VITC-50", "CLAR-DS-EYE-20", "SF-LBB-PINKSUGAR"],
    productNames: ["BARUBT Dewy Universal Tinted Moisturizer SPF 46", "Kiehl's Ultra Facial Cream 50ml", "Kiehl's Powerful-Strength Vitamin C Serum 50ml", "Clarins Double Serum Eye 20ml", "Summer Fridays Lip Butter Balm - Pink Sugar"],
  },
  {
    id: "bundle-post-procedure",
    name: "Post-Procedure Recovery Kit",
    tagline: "Heal. Restore. Protect.",
    discount: "22% OFF",
    originalPrice: "$88.00",
    bundlePrice: "$69.00",
    savings: "$19.00",
    productSkus: ["RKA-007", "MOV-004-1OZ", "CARV-4IN1-30", "CARV-PDRN-50", "CARV-SCAR-50"],
    productNames: ["EELHOE Sun Cream SPF90 40g", "MOV Cellular Repair Mist 1 oz", "Carvenchy 4-in-1 Facial Serum 30ml", "Carvenchy PDRN Collagen Jelly Cream 50ml", "Carvenchy Silicone Scar Cream 50ml"],
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
