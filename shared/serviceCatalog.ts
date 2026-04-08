/**
 * Complete service catalog with pricing.
 * This data is used by the AI analysis engine to recommend only
 * services and products that the clinic actually offers.
 */

export interface ServiceItem {
  name: string;
  price: string;
  category: string;
  description?: string;
}

export interface ServiceCategory {
  category: string;
  services: ServiceItem[];
}

export const SERVICE_CATALOG: ServiceCategory[] = [
  {
    category: "Neurotoxins",
    services: [
      { name: "Jeuveau / Xeomin / Letybo / Botox", price: "$12/unit", category: "Neurotoxins" },
      { name: "Daxxify", price: "$9/unit", category: "Neurotoxins" },
    ],
  },
  {
    category: "Dermal Filler",
    services: [
      { name: "All Fillers", price: "$600", category: "Dermal Filler" },
    ],
  },
  {
    category: "Chemical Peels",
    services: [
      { name: "All Light Peel", price: "$150", category: "Chemical Peels" },
      { name: "No Peel-Chemical Peel", price: "$165", category: "Chemical Peels" },
      { name: "The Perfect Derma", price: "$350", category: "Chemical Peels" },
    ],
  },
  {
    category: "Microneedling",
    services: [
      { name: "Pen Microneedling", price: "$350", category: "Microneedling" },
      { name: "RF Microneedling", price: "$450", category: "Microneedling" },
    ],
  },
  {
    category: "HIFU",
    services: [
      { name: "HIFU - Full Face", price: "$450", category: "HIFU" },
      { name: "HIFU - Face & Neck", price: "$550", category: "HIFU" },
      { name: "HIFU - Jawline/Chin", price: "$350", category: "HIFU" },
      { name: "HIFU - Neck", price: "$300", category: "HIFU" },
    ],
  },
  {
    category: "Ultherapy",
    services: [
      { name: "Ultherapy - Brow Lift", price: "$750", category: "Ultherapy", description: "Micro-focused ultrasound with visualization (MFU-V) targeting the brow area for precise lifting and tightening" },
      { name: "Ultherapy - Lower Face", price: "$1,200", category: "Ultherapy", description: "Precision ultrasound lifting for jowls, jawline definition, and lower face tightening with real-time tissue visualization" },
      { name: "Ultherapy - Full Face", price: "$1,800", category: "Ultherapy", description: "Comprehensive micro-focused ultrasound treatment for full face lifting — forehead, cheeks, jawline, and chin" },
      { name: "Ultherapy - Neck", price: "$1,200", category: "Ultherapy", description: "Targeted ultrasound lifting for neck laxity, turkey neck, and platysmal bands with real-time visualization" },
      { name: "Ultherapy - Full Face & Neck", price: "$2,500", category: "Ultherapy", description: "Complete micro-focused ultrasound treatment for face and neck — the gold standard in precision ultrasound lifting" },
      { name: "Ultherapy - Decolletage", price: "$900", category: "Ultherapy", description: "Ultrasound lifting for chest wrinkles, crepey skin, and sun damage on the decolletage" },
      { name: "Ultherapy - Full Face, Neck & Chest", price: "$3,200", category: "Ultherapy", description: "The ultimate precision lifting package — full face, neck, and chest with micro-focused ultrasound and real-time visualization" },
    ],
  },
  {
    category: "RKsculpt",
    services: [
      { name: "RKsculpt - Single Session", price: "$400", category: "RKsculpt" },
      { name: "RKsculpt - Pack of 4", price: "$1,200", category: "RKsculpt" },
      { name: "RKsculpt - Pack of 6", price: "$1,500", category: "RKsculpt" },
      { name: "RKsculpt - Pack of 10", price: "$2,000", category: "RKsculpt" },
    ],
  },
  {
    category: "Lipolytic Injections",
    services: [
      { name: "Lemon Bottle", price: "$150/vial", category: "Lipolytic Injections" },
      { name: "PCDC", price: "$150/vial", category: "Lipolytic Injections" },
      { name: "Deoycholic Acid", price: "$150/vial", category: "Lipolytic Injections" },
    ],
  },
  {
    category: "Skin Tightening",
    services: [
      { name: "RF Skin Tightening", price: "$150", category: "Skin Tightening" },
      { name: "RF Skin Tightening Pack of 5", price: "$500", category: "Skin Tightening" },
    ],
  },
  {
    category: "Intense Pulse Light (IPL)",
    services: [
      { name: "IPL", price: "$300", category: "IPL" },
      { name: "IPL Pack of 3", price: "$720", category: "IPL" },
    ],
  },
  {
    category: "PICO/ND:YAG",
    services: [
      { name: "Pico/ND:YAG", price: "$300", category: "PICO/ND:YAG" },
      { name: "Pico/ND:YAG Pack of 3", price: "$720", category: "PICO/ND:YAG" },
    ],
  },
  {
    category: "CO2 Laser Resurfacing",
    services: [
      { name: "CO2 Laser - Full Face", price: "$750", category: "CO2 Laser Resurfacing", description: "Fractional CO2 laser for deep wrinkles, acne scars, sun damage, and full skin resurfacing of the face" },
      { name: "CO2 Laser - Face & Neck", price: "$1,100", category: "CO2 Laser Resurfacing", description: "Comprehensive CO2 laser resurfacing for face and neck — treats wrinkles, texture, laxity, and sun damage" },
      { name: "CO2 Laser - Neck Only", price: "$500", category: "CO2 Laser Resurfacing", description: "Targeted CO2 laser resurfacing for neck lines, crepey skin, and sun damage on the neck" },
    ],
  },
  {
    category: "Collagen Induction",
    services: [
      { name: "Sculptra", price: "$800", category: "Collagen Induction" },
      { name: "Radiesse", price: "$800", category: "Collagen Induction" },
    ],
  },
  {
    category: "Laser Hair Reduction",
    services: [
      { name: "Laser Hair Reduction - Upper Lip", price: "$35", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Chin", price: "$45", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Neck (Front/Back)", price: "$75", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Underarms", price: "$85", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Bikini Line", price: "$95", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Face (Full)", price: "$120", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Abdomen", price: "$125", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Arms (Full)", price: "$180", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Chest", price: "$175", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Back", price: "$220", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Brazilian", price: "$160", category: "Laser Hair Reduction" },
      { name: "Laser Hair Reduction - Legs (Full)", price: "$280", category: "Laser Hair Reduction" },
    ],
  },
  {
    category: "Laser Hair Reduction - Pack of 6",
    services: [
      { name: "Laser Hair Pack of 6 - Upper Lip", price: "$135", category: "Laser Hair Reduction" },
      { name: "Laser Hair Pack of 6 - Chin", price: "$162", category: "Laser Hair Reduction" },
      { name: "Laser Hair Pack of 6 - Neck (Front/Back)", price: "$351", category: "Laser Hair Reduction" },
      { name: "Laser Hair Pack of 6 - Underarms", price: "$459", category: "Laser Hair Reduction" },
      { name: "Laser Hair Pack of 6 - Bikini Line", price: "$513", category: "Laser Hair Reduction" },
      { name: "Laser Hair Pack of 6 - Brazilian", price: "$864", category: "Laser Hair Reduction" },
      { name: "Laser Hair Pack of 6 - Full Legs", price: "$1,512", category: "Laser Hair Reduction" },
    ],
  },
  {
    category: "Intense Pulse Light - Pack of 8",
    services: [
      { name: "IPL Pack of 8 - Upper Lip", price: "$170", category: "IPL" },
      { name: "IPL Pack of 8 - Chin", price: "$204", category: "IPL" },
      { name: "IPL Pack of 8 - Neck (Front/Back)", price: "$442", category: "IPL" },
      { name: "IPL Pack of 8 - Underarms", price: "$578", category: "IPL" },
      { name: "IPL Pack of 8 - Bikini Line", price: "$646", category: "IPL" },
      { name: "IPL Pack of 8 - Brazilian", price: "$1,088", category: "IPL" },
      { name: "IPL Pack of 8 - Full Legs", price: "$1,904", category: "IPL" },
    ],
  },
  {
    category: "Facials",
    services: [
      { name: "The Radiant Renewal Facial (Dermaplaning)", price: "$115", category: "Facials" },
      { name: "Pumpkin Enzyme Glow Facial", price: "$125", category: "Facials" },
      { name: "Microdelivery Glass Skin Facial", price: "$145", category: "Facials" },
      { name: "24K Gold Recovery Facial", price: "$145", category: "Facials" },
      { name: "Blueberry Detox Firming Facial", price: "$155", category: "Facials" },
      { name: "Radiant Retinol Renewal Facial (Alpharet)", price: "$185", category: "Facials" },
      { name: "Glo2 Oxygen Infusion Facial", price: "$200", category: "Facials" },
    ],
  },
  {
    category: "Facial Add-Ons",
    services: [
      { name: "Dermaplaning (Add-On)", price: "$50", category: "Facial Add-Ons" },
      { name: "Manual Extractions (Add-On)", price: "$40", category: "Facial Add-Ons" },
      { name: "LED Light Therapy (Add-On)", price: "$35", category: "Facial Add-Ons" },
      { name: "Radiofrequency Skin Tightening (10 minutes) (Add-On)", price: "$50", category: "Facial Add-Ons" },
    ],
  },
  {
    category: "Memberships (Facials)",
    services: [
      { name: "Glow Monthly Membership", price: "$110/month", category: "Memberships" },
      { name: "Radiance Plus Membership", price: "$149/month", category: "Memberships" },
      { name: "GLO Elite Membership", price: "$179/month", category: "Memberships" },
    ],
  },
  {
    category: "Memberships (Other)",
    services: [
      { name: "Tox Membership", price: "$90/month", category: "Memberships" },
      { name: "Radiant Glow Club", price: "$149/month", category: "Memberships" },
      { name: "Laser Smooth Membership", price: "$99/month", category: "Memberships" },
      { name: "Laser Luxe Membership", price: "$149/month", category: "Memberships" },
      { name: "Laser Elite Membership", price: "$199/month", category: "Memberships" },
    ],
  },
  {
    category: "Medical Weight Loss",
    services: [
      { name: "Semaglutide (GLP-1) — Monthly Program", price: "$399/month", category: "Medical Weight Loss", description: "FDA-approved GLP-1 receptor agonist for medical weight management. Includes weekly injections, monthly check-ins, and nutritional guidance. Average 15-20% body weight loss over 12 months." },
      { name: "Tirzepatide — Monthly Program", price: "$499/month", category: "Medical Weight Loss", description: "Dual GIP/GLP-1 receptor agonist for enhanced weight loss. Includes weekly injections, monthly provider visits, and metabolic monitoring. Average 20-25% body weight loss over 12 months." },
      { name: "Medical Weight Loss Consultation", price: "$150", category: "Medical Weight Loss", description: "Comprehensive initial consultation including BMI assessment, metabolic panel review, medical history evaluation, and personalized weight loss plan." },
      { name: "B12 + Lipotropic Injection", price: "$35", category: "Medical Weight Loss", description: "Energy-boosting B12 with fat-burning lipotropic compounds (MIC) to support metabolism and weight loss." },
    ],
  },
  {
    category: "Peptide Therapy",
    services: [
      { name: "BPC-157 Peptide Therapy", price: "$350/month", category: "Peptide Therapy", description: "Body Protection Compound peptide for tissue repair, gut healing, and accelerated recovery. Subcutaneous injection protocol with monthly provider monitoring." },
      { name: "GHK-Cu Peptide Therapy", price: "$300/month", category: "Peptide Therapy", description: "Copper peptide therapy for skin rejuvenation, collagen synthesis, wound healing, and anti-aging. Promotes hair growth and reduces fine lines." },
      { name: "Thymosin Alpha-1 Peptide Therapy", price: "$400/month", category: "Peptide Therapy", description: "Immune-modulating peptide that enhances immune function, reduces inflammation, and supports overall wellness and longevity." },
      { name: "CJC-1295/Ipamorelin Peptide Therapy", price: "$375/month", category: "Peptide Therapy", description: "Growth hormone releasing peptide combination for anti-aging, improved sleep, increased lean muscle mass, fat loss, and enhanced recovery." },
      { name: "Peptide Therapy Consultation", price: "$150", category: "Peptide Therapy", description: "Initial consultation with comprehensive lab review, health assessment, and personalized peptide protocol design." },
    ],
  },
  {
    category: "Hormone Replacement Therapy",
    services: [
      { name: "Bioidentical Hormone Replacement — Female", price: "$250/month", category: "Hormone Replacement Therapy", description: "Customized bioidentical hormone therapy for women including estrogen, progesterone, and testosterone optimization. Monthly monitoring with lab work." },
      { name: "Testosterone Replacement Therapy — Male", price: "$225/month", category: "Hormone Replacement Therapy", description: "Testosterone optimization for men including weekly injections, quarterly lab monitoring, and ongoing provider management." },
      { name: "Thyroid Optimization", price: "$200/month", category: "Hormone Replacement Therapy", description: "Comprehensive thyroid hormone management including T3/T4 optimization, regular lab monitoring, and medication management." },
      { name: "Hormone Replacement Therapy Consultation", price: "$200", category: "Hormone Replacement Therapy", description: "In-depth initial consultation with comprehensive hormone panel, symptom assessment, and personalized treatment plan." },
      { name: "Hormone Panel Lab Work", price: "$250", category: "Hormone Replacement Therapy", description: "Comprehensive hormone panel including testosterone, estrogen, progesterone, DHEA, cortisol, thyroid (TSH, T3, T4), and metabolic markers." },
    ],
  },
  {
    category: "Hair Restoration",
    services: [
      { name: "Exosome Hair Therapy — Single Session", price: "$1,200", category: "Hair Restoration", description: "Advanced exosome therapy with growth factors and stem cell-derived exosomes for enhanced hair regrowth and follicle regeneration." },
      { name: "Exosome Hair Therapy — Pack of 3", price: "$3,000", category: "Hair Restoration", description: "Three-session exosome hair restoration series spaced 4-6 weeks apart for optimal results. Recommended for moderate to advanced hair thinning." },
    ],
  },
  {
    category: "Scar Treatment Packages",
    services: [
      { name: "Acne Scar Starter — 3x Microneedling + PRP", price: "$1,650", category: "Scar Treatment Packages", description: "3 sessions of microneedling with PRP for mild acne scarring (ice pick, boxcar, rolling). Sessions spaced 4-6 weeks apart. Save $300 vs individual pricing." },
      { name: "Acne Scar Comprehensive — Subcision + TCA CROSS + RF Microneedling", price: "$4,800", category: "Scar Treatment Packages", description: "8-session package: 2x subcision, 3x TCA CROSS, 3x RF microneedling for moderate-to-severe acne scarring. Multi-step protocol targeting tethering, depth, and texture. Save $1,100." },
      { name: "Acne Scar Premium — Subcision + TCA CROSS + Filler + CO2 Laser", price: "$6,500", category: "Scar Treatment Packages", description: "9-session premium package: 2x subcision, 3x TCA CROSS, 1 syringe HA filler, 3x fractional CO2 laser for severe acne scarring. The gold-standard multi-step scar protocol. Save $1,600." },
      { name: "Hypertrophic Scar Basic — 3x Steroid Injection + Silicone", price: "$650", category: "Scar Treatment Packages", description: "3 sessions of intralesional triamcinolone (TAC) injection plus 3-month silicone sheeting supply for raised hypertrophic scars. Sessions every 4 weeks." },
      { name: "Hypertrophic Scar Advanced — 5-FU/TAC + PDL + Silicone", price: "$2,400", category: "Scar Treatment Packages", description: "7-session package: 4x 5-FU/TAC combo injections + 3x pulsed dye laser + 3-month silicone supply for resistant hypertrophic scars. Save $500." },
      { name: "Keloid Control — 6x 5-FU/TAC Combo + Silicone", price: "$1,800", category: "Scar Treatment Packages", description: "6 sessions of 5-FU + triamcinolone combination injections plus 6-month silicone supply for keloid scars. Injections every 4 weeks. Save $240." },
      { name: "Keloid Comprehensive — 5-FU/TAC + PDL + Silicone", price: "$3,000", category: "Scar Treatment Packages", description: "9-session package: 6x 5-FU/TAC combo + 3x pulsed dye laser + 6-month silicone supply for moderate-to-large keloids. Save $590." },
      { name: "Surgical Scar Basic — 3x PDL + Silicone", price: "$1,350", category: "Scar Treatment Packages", description: "3 sessions of pulsed dye laser plus 3-month silicone supply for red/pink surgical or traumatic scars. Sessions every 4-6 weeks. Save $120." },
      { name: "Surgical Scar Comprehensive — Subcision + Filler + RF Microneedling", price: "$3,800", category: "Scar Treatment Packages", description: "6-session package: 2x subcision + 1 syringe HA filler + 3x RF microneedling for depressed or wide surgical scars. Save $700." },
      { name: "Stretch Mark Starter — 3x Microneedling + PRP (Body)", price: "$1,800", category: "Scar Treatment Packages", description: "3 sessions of microneedling with PRP for stretch marks on abdomen, thighs, or arms. Body-area pricing. Sessions spaced 4-6 weeks apart. Save $150." },
      { name: "Stretch Mark Comprehensive — RF Microneedling + Erbium Laser", price: "$4,500", category: "Scar Treatment Packages", description: "6-session package: 3x RF microneedling + 3x fractional erbium laser for moderate-to-severe stretch marks. Save $600." },
      { name: "PIH Basic — 4x Chemical Peels + Home Care Kit", price: "$1,100", category: "Scar Treatment Packages", description: "4 sessions of medium-depth chemical peels plus a home care kit (hydroquinone, tretinoin, vitamin C, SPF) for post-inflammatory hyperpigmentation. Save $100." },
      { name: "PIH Comprehensive — Chemical Peels + IPL + Home Care", price: "$2,200", category: "Scar Treatment Packages", description: "7-session package: 4x chemical peels + 3x IPL + home care kit for stubborn hyperpigmentation (Fitzpatrick I-IV only). Save $350." },
      { name: "Burn Scar Basic — 4x PDL + Silicone", price: "$1,900", category: "Scar Treatment Packages", description: "4 sessions of pulsed dye laser plus 6-month silicone supply for burn scars with redness and raised texture. Save $240." },
      { name: "Burn Scar Comprehensive — PDL + CO2 Laser + Silicone", price: "$4,800", category: "Scar Treatment Packages", description: "7-session package: 4x PDL + 3x fractional CO2 laser + 6-month silicone supply for moderate burn scars. Save $840." },
    ],
  },
];

/**
 * Generate a formatted text version of the service catalog for the AI prompt.
 */
export function getServiceCatalogText(): string {
  let text = "=== CLINIC SERVICE CATALOG WITH PRICING ===\n\n";
  text += "IMPORTANT: You must ONLY recommend services and treatments from this catalog. Include the exact price for each recommendation.\n\n";

  for (const cat of SERVICE_CATALOG) {
    text += `--- ${cat.category} ---\n`;
    for (const svc of cat.services) {
      text += `  • ${svc.name} — ${svc.price}\n`;
    }
    text += "\n";
  }

  text += "=== END OF CATALOG ===\n";
  return text;
}
