import { describe, expect, it } from "vitest";
import { formatStatusLabel } from "./string-utils";

describe("string-utils", () => {
  it("formats kebab-case and snake_case into title case labels", () => {
    expect(formatStatusLabel("new")).toBe("New");
    expect(formatStatusLabel("in_progress")).toBe("In Progress");
    expect(formatStatusLabel("contacted-via_email")).toBe("Contacted Via Email");
  });

  it("handles multiple separators and casing gracefully", () => {
    expect(formatStatusLabel("ALREADY_FORMATTED")).toBe("ALREADY FORMATTED");
    expect(formatStatusLabel("mixed-Case_status")).toBe("Mixed Case Status");
  });
});

