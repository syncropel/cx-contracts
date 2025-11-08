import { describe, it, expect } from "vitest";
import { z } from "zod";
import { MetadataSchema } from "../../src/common/metadata";
import { UuidSchema } from "../../src/common/primitives";

describe("MetadataSchema", () => {
  // We'll create a simple dummy schema to test composition
  const TestResourceSchema = z
    .object({
      id: UuidSchema,
      name: z.string(),
    })
    .merge(MetadataSchema);

  it("should validate a resource with minimal metadata", () => {
    const resource = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Resource",
      created_at: "2024-11-08T15:00:00Z",
      updated_at: "2024-11-08T15:05:00Z",
    };
    // .parse() will apply the .default([]) for tags
    const parsed = TestResourceSchema.parse(resource);
    expect(parsed.tags).toEqual([]);
    expect(parsed.created_by).toBeUndefined();
  });

  it("should validate a resource with all metadata fields", () => {
    const resource = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Resource",
      created_at: "2024-11-08T15:00:00Z",
      updated_at: "2024-11-08T15:05:00Z",
      created_by: "550e8400-e29b-41d4-a716-446655440000",
      tags: ["test", "metadata"],
    };
    expect(() => TestResourceSchema.parse(resource)).not.toThrow();
  });

  it("should reject if 'created_at' is missing", () => {
    const resource = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Resource",
      updated_at: "2024-11-08T15:05:00Z",
    };
    expect(() => TestResourceSchema.parse(resource)).toThrow();
  });

  it("should reject if 'updated_at' has an invalid format", () => {
    const resource = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Resource",
      created_at: "2024-11-08T15:00:00Z",
      updated_at: "invalid-date",
    };
    expect(() => TestResourceSchema.parse(resource)).toThrow();
  });

  it("should apply the default empty array for 'tags' if it's missing", () => {
    const resource = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Resource",
      created_at: "2024-11-08T15:00:00Z",
      updated_at: "2024-11-08T15:05:00Z",
    };
    const parsed = TestResourceSchema.parse(resource);
    expect(parsed.tags).toBeInstanceOf(Array);
    expect(parsed.tags).toHaveLength(0);
  });
});
