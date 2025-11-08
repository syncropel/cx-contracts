import { describe, it, expect } from "vitest";
import { ResourcePolicySchema } from "../../src/common/resource-policy";

describe("ResourcePolicySchema", () => {
  it("should validate a minimal policy, applying defaults", () => {
    const policy = {}; // Completely empty
    const parsed = ResourcePolicySchema.parse(policy);

    expect(parsed.network_access).toBe("none");
    expect(parsed.cpu_request).toBe("250m");
    expect(parsed.memory_request).toBe("512Mi");
    expect(parsed.max_execution_time).toBe("5m");
    expect(parsed.allowed_secrets).toEqual([]);
    expect(parsed.vfs_policy).toBeUndefined();
  });

  it("should validate a comprehensive, strict policy", () => {
    const policy = {
      network_access: "private",
      cpu_request: "1",
      memory_request: "2Gi",
      max_execution_time: "1h",
      allowed_secrets: ["db-password", "api-key"],
      vfs_policy: {
        allowed_schemes: ["file", "s3"],
        allowed_prefixes: ["/data/"],
        deny_patterns: ["**/*.log"],
      },
    };
    expect(() => ResourcePolicySchema.parse(policy)).not.toThrow();
  });

  it("should reject an invalid 'network_access' value", () => {
    const policy = { network_access: "unrestricted" };
    expect(() => ResourcePolicySchema.parse(policy)).toThrow();
  });

  it("should reject an invalid 'cpu_request' format", () => {
    const policy = { cpu_request: "one core" };
    expect(() => ResourcePolicySchema.parse(policy)).toThrow();
  });

  it("should reject an invalid 'memory_request' format", () => {
    const policy = { memory_request: "1024mb" }; // needs Mi
    expect(() => ResourcePolicySchema.parse(policy)).toThrow();
  });

  it("should reject an invalid 'max_execution_time' format", () => {
    const policy = { max_execution_time: "10 minutes" }; // needs 'm'
    expect(() => ResourcePolicySchema.parse(policy)).toThrow();
  });

  it("should correctly parse a VFS policy", () => {
    const policy = {
      vfs_policy: {
        allowed_schemes: ["http", "https"],
      },
    };
    const parsed = ResourcePolicySchema.parse(policy);
    expect(parsed.vfs_policy?.allowed_schemes).toEqual(["http", "https"]);
  });

  it("should apply default for empty VFS policy schemes", () => {
    const policy = {
      vfs_policy: {}, // Empty policy
    };
    const parsed = ResourcePolicySchema.parse(policy);
    expect(parsed.vfs_policy?.allowed_schemes).toEqual([]);
  });
});
