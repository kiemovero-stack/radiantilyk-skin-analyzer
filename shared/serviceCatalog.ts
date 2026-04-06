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
