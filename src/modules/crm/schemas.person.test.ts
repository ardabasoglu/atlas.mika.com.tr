import { describe, expect, it } from "vitest";
import {
  createPersonPayloadSchema,
  personSchema,
  updatePersonDetailsPayloadSchema,
} from "./schemas";

describe("person schemas", () => {
  it("accepts archivedAt as optional ISO datetime", () => {
    const nowIso = new Date().toISOString();
    const result = personSchema.safeParse({
      id: "person-1",
      leadId: "lead-1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+905551112233",
      notes: "Sample note",
      archivedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    expect(result.success).toBe(true);
  });

  it("requires name, email and phone on create person payload", () => {
    const result = createPersonPayloadSchema.safeParse({
      name: "",
      email: "invalid-email",
      phone: "",
      notes: "Sample note",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid update person payload", () => {
    const result = updatePersonDetailsPayloadSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+905551112233",
      notes: "Updated note",
    });

    expect(result.success).toBe(true);
  });
});
