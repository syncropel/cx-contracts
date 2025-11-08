import { describe, it, expect } from "vitest";
import { BlockSchema } from "../../src/engine/block";

describe("BlockSchema", () => {
  it("should validate a minimal valid block", () => {
    const block = {
      id: "my-block",
      engine: "system:python",
    };
    expect(() => BlockSchema.parse(block)).not.toThrow();
  });

  it("should reject a block with both engine and connection", () => {
    const block = {
      id: "bad-block",
      engine: "system:python",
      connection: "user:my-db",
    };
    expect(() => BlockSchema.parse(block)).toThrow();
  });
});
