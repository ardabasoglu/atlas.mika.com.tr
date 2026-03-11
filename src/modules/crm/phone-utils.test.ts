import { describe, expect, it } from "vitest";
import {
  formatTurkeyLocalPhone,
  normalizePhoneToE164,
  splitPhoneForState,
} from "./phone-utils";

describe("phone-utils", () => {
  it("formats Turkish local phone numbers correctly", () => {
    expect(formatTurkeyLocalPhone("5327778899")).toBe("532 777 88 99");
    expect(formatTurkeyLocalPhone("5327")).toBe("532 7");
    expect(formatTurkeyLocalPhone("5")).toBe("5");
  });

  it("normalizes phone numbers to E.164", () => {
    expect(normalizePhoneToE164("+90", "532 777 88 99")).toBe(
      "+905327778899",
    );
    expect(normalizePhoneToE164("+44", "7911 123456")).toBe("+447911123456");
    expect(normalizePhoneToE164("+90", "545 423 4")).toBeNull();
  });

  it("splits stored phone into state correctly", () => {
    expect(splitPhoneForState("+905327778899")).toEqual({
      phoneCountryCode: "+90",
      phoneLocalPart: "532 777 88 99",
    });
    expect(splitPhoneForState("+447911123456")).toEqual({
      phoneCountryCode: "+447",
      phoneLocalPart: "911123456",
    });
    expect(splitPhoneForState(null)).toEqual({
      phoneCountryCode: "+90",
      phoneLocalPart: "",
    });
  });
})

