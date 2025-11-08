import { describe, it, expect } from "vitest";
import { ConnectionSchema } from "../../src/data/connection";

describe("ConnectionSchema", () => {
  const now = new Date().toISOString();

  it("should validate a minimal valid connection object", () => {
    const connection = {
      id: "user:my-db",
      name: "My Production DB",
      api_catalog_id: "community/postgres@1.0",
      auth_method_type: "user-pass",
      created_at: now,
      updated_at: now,
    };
    const parsed = ConnectionSchema.parse(connection);
    expect(parsed.status).toBe("untested");
    expect(parsed.details).toEqual({});
  });

  it("should validate a connection with all optional fields", () => {
    const connection = {
      id: "user:my-db",
      name: "My Production DB",
      description: "The main database for the finance app.",
      api_catalog_id: "community/postgres@1.0",
      auth_method_type: "user-pass",
      details: {
        host: "db.example.com",
        port: 5432,
      },
      tags: ["production", "finance"],
      owner_id: "123e4567-e89b-12d3-a456-426614174000",
      vault_secret_path: "kv/prod/db/finance",
      status: "active",
      last_tested_at: now,
      created_at: now,
      updated_at: now,
    };
    expect(() => ConnectionSchema.parse(connection)).not.toThrow();
  });

  it("should reject a connection with a missing 'name'", () => {
    const connection = {
      id: "user:my-db",
      // name is missing
      api_catalog_id: "community/postgres@1.0",
      auth_method_type: "user-pass",
      created_at: now,
      updated_at: now,
    };
    expect(() => ConnectionSchema.parse(connection)).toThrow();
  });
});
