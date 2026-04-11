import { describe, it, expect } from "vitest";

/**
 * Test the pricing parser logic used in Report.tsx to ensure
 * ranges, single values, and edge cases are handled correctly.
 */
function parseTotalCost(totalCost: string): number {
  // Handle ranges like "$120-$240" by averaging
  const rangeMatch = totalCost.match(/\$([\d,]+(?:\.\d+)?)/g);
  if (rangeMatch && rangeMatch.length >= 2) {
    const low = parseFloat(rangeMatch[0].replace(/[^0-9.]/g, ''));
    const high = parseFloat(rangeMatch[1].replace(/[^0-9.]/g, ''));
    if (!isNaN(low) && !isNaN(high)) {
      return Math.round((low + high) / 2);
    }
  }
  // Single value — extract first dollar amount only
  const singleMatch = totalCost.match(/\$([\d,]+(?:\.\d+)?)/);
  if (singleMatch) {
    const num = parseFloat(singleMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num <= 15000) return num;
  }
  return 0;
}

describe("Treatment Pricing Parser", () => {
  it("parses a simple dollar amount", () => {
    expect(parseTotalCost("$350")).toBe(350);
  });

  it("parses a dollar amount with commas", () => {
    expect(parseTotalCost("$1,050")).toBe(1050);
  });

  it("parses a dollar amount with cents", () => {
    expect(parseTotalCost("$38.00")).toBe(38);
  });

  it("handles a range by averaging the two values", () => {
    expect(parseTotalCost("$120-$240 (estimate)")).toBe(180);
  });

  it("handles a range without parenthetical text", () => {
    expect(parseTotalCost("$200-$400")).toBe(300);
  });

  it("handles a range with 'to' wording", () => {
    expect(parseTotalCost("$500 to $1,000")).toBe(750);
  });

  it("caps single items at $15,000", () => {
    expect(parseTotalCost("$120240")).toBe(0);
  });

  it("returns 0 for unparseable strings", () => {
    expect(parseTotalCost("TBD")).toBe(0);
  });

  it("returns 0 for empty string", () => {
    expect(parseTotalCost("")).toBe(0);
  });

  it("correctly sums a realistic pricing array", () => {
    const pricing = [
      { totalCost: "$720" },
      { totalCost: "$600" },
      { totalCost: "$1,350" },
      { totalCost: "$120-$240 (estimate)" }, // The Botox bug case
      { totalCost: "$200" },
      { totalCost: "$185" },
      { totalCost: "$155" },
      { totalCost: "$38.00" },
      { totalCost: "$58.00" },
      { totalCost: "$42.00" },
      { totalCost: "$38.00" },
      { totalCost: "$58.00" },
      { totalCost: "$20.00" },
    ];
    let total = 0;
    pricing.forEach(p => { total += parseTotalCost(p.totalCost); });
    // Should be ~$3,644 not $123,704
    expect(total).toBeGreaterThan(3000);
    expect(total).toBeLessThan(5000);
  });
});
