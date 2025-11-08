import { describe, it, expect } from "vitest";
import { DocumentSchema } from "../../src/engine/document";

describe("DocumentSchema", () => {
  it("should validate a minimal valid document", () => {
    const doc = {
      id: "my-project/my-doc",
      name: "My Document",
      blocks: [
        {
          id: "block-1",
          engine: "markdown",
          content: "Hello, world!",
        },
      ],
    };
    expect(() => DocumentSchema.parse(doc)).not.toThrow();
  });

  it("should reject a document with no blocks", () => {
    const doc = {
      id: "my-project/my-doc",
      name: "My Document",
      blocks: [], // Must have at least one block
    };
    expect(() => DocumentSchema.parse(doc)).toThrow();
  });
});
