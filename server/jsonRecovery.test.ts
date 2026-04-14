import { describe, it, expect } from "vitest";
import { recoverTruncatedJson } from "./jsonRecovery";

describe("recoverTruncatedJson", () => {
  it("returns valid JSON as-is", () => {
    const result = recoverTruncatedJson('{"name": "test", "value": 42}');
    expect(result).toEqual({ name: "test", value: 42 });
  });

  it("closes unclosed braces", () => {
    const result = recoverTruncatedJson('{"name": "test", "nested": {"a": 1}');
    expect(result).toHaveProperty("name", "test");
  });

  it("closes unclosed brackets", () => {
    const result = recoverTruncatedJson('{"items": [1, 2, 3');
    expect(result).toHaveProperty("items");
    expect((result as any).items).toContain(1);
  });

  it("handles truncated string mid-value", () => {
    // Truncated in the middle of a string value
    const result = recoverTruncatedJson('{"name": "test", "desc": "this is a long descri');
    expect(result).toHaveProperty("name", "test");
  });

  it("handles deeply nested truncation", () => {
    const result = recoverTruncatedJson('{"a": {"b": {"c": [1, 2, {"d": "val');
    expect(result).toHaveProperty("a");
  });

  it("handles truncation after a comma", () => {
    const result = recoverTruncatedJson('{"items": [{"name": "a"}, {"name": "b"},');
    expect(result).toHaveProperty("items");
    expect((result as any).items).toHaveLength(2);
  });

  it("handles empty object", () => {
    const result = recoverTruncatedJson('{}');
    expect(result).toEqual({});
  });

  it("handles empty array", () => {
    const result = recoverTruncatedJson('[]');
    expect(result).toEqual([]);
  });

  it("handles real-world truncated skin analysis JSON", () => {
    // Simulates the actual failure: JSON cut off mid-string at ~50k chars
    const json = '{"skinHealthScore": 62, "conditions": [{"name": "Acne Scarring", "severity": "moderate", "description": "Visible atrophic scarring on both cheeks with ice pick and boxcar patterns. The scarring is most prominent on the lower cheeks and extends toward the jawli';
    const result = recoverTruncatedJson(json);
    expect(result).toHaveProperty("skinHealthScore", 62);
    expect(result).toHaveProperty("conditions");
  });

  it("throws on completely invalid input", () => {
    expect(() => recoverTruncatedJson("not json at all")).toThrow();
  });

  it("handles escaped quotes inside strings", () => {
    const result = recoverTruncatedJson('{"msg": "She said \\"hello\\"", "val": 1}');
    expect(result).toHaveProperty("val", 1);
  });
});
