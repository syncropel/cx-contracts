import { describe, it, expect } from "vitest";
import {
  TimestampSchema,
  UuidSchema,
  VersionSchema,
  ExecutionStatusSchema,
} from "../../src/common/primitives";

describe("Common Primitives", () => {
  describe("TimestampSchema", () => {
    it("should validate a valid ISO 8601 datetime string", () => {
      expect(() =>
        TimestampSchema.parse("2024-11-08T14:30:00.123Z")
      ).not.toThrow();
    });

    it("should reject an invalid datetime string", () => {
      expect(() => TimestampSchema.parse("not-a-date")).toThrow();
    });
  });

  describe("UuidSchema", () => {
    it("should validate a valid UUID", () => {
      expect(() =>
        UuidSchema.parse("550e8400-e29b-41d4-a716-446655440000")
      ).not.toThrow();
    });

    it("should reject an invalid UUID", () => {
      expect(() => UuidSchema.parse("not-a-uuid")).toThrow();
    });
  });

  describe("VersionSchema", () => {
    it("should validate a valid SemVer string", () => {
      expect(() => VersionSchema.parse("2.3.1")).not.toThrow();
      expect(() => VersionSchema.parse("3.0.0-beta.2")).not.toThrow();
    });

    it("should reject an invalid SemVer string", () => {
      expect(() => VersionSchema.parse("v2.3.1")).toThrow(); // 'v' prefix is not allowed
      expect(() => VersionSchema.parse("2.3")).toThrow(); // missing patch
    });
  });

  describe("ExecutionStatusSchema", () => {
    it("should validate all allowed execution statuses", () => {
      const statuses = [
        "pending",
        "running",
        "success",
        "failed",
        "skipped",
        "cancelled",
      ];
      statuses.forEach((status) => {
        expect(() => ExecutionStatusSchema.parse(status)).not.toThrow();
      });
    });

    it("should reject an invalid status", () => {
      expect(() => ExecutionStatusSchema.parse("completed")).toThrow();
    });
  });
});
