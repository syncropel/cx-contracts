import { describe, it, expect } from "vitest";
import { migrations } from "../../src/migrations/registry";
import "../../src/migrations/v1-to-v2/user"; // Import to ensure migration is registered

describe("User Schema Migrations", () => {
  describe("v1.0.0 to v2.0.0", () => {
    const v1User = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John Doe",
      age: 30,
      created_at: "2024-01-01T00:00:00Z",
    };

    it("should correctly migrate data from v1 to v2", () => {
      const migratedUser = migrations.migrate("User", v1User, "1.0.0", "2.0.0");

      // Check for renamed field
      expect(migratedUser).toHaveProperty("display_name", "John Doe");
      expect(migratedUser).not.toHaveProperty("name");

      // Check for added field
      expect(migratedUser.email).toContain(
        "@migration-placeholder.syncropel.com"
      );

      // Check for removed field
      expect(migratedUser).not.toHaveProperty("age");

      // Check that other fields are preserved
      expect(migratedUser.id).toBe(v1User.id);
    });

    it("should throw an error if no migration path exists", () => {
      expect(() =>
        migrations.migrate("User", v1User, "1.0.0", "3.0.0")
      ).toThrow(
        "No migration path found for schema 'User' from version 1.0.0 to 3.0.0."
      );
    });
  });
});
