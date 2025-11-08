/**
 * Domain 0: Common Primitives
 *
 * This file defines the CRITICAL ResourcePolicySchema, which serves as the
 * security contract for all capabilities running within the Syncropel Engine.
 *
 * @module common/resource-policy
 * @security CRITICAL
 * @version 2.0.0
 */
import { z } from "zod";

/**
 * Defines the level of network access a capability is permitted to have.
 * This is a core security boundary. The default is 'none'.
 */
export const NetworkAccessSchema = z.enum([
  "none", // No network access whatsoever. The safest default.
  "private", // Can only access internal services within the VPC/cluster.
  "public", // Unrestricted access to the public internet. Requires high trust.
]);

/**
 * Defines a policy for accessing the Virtual File System (VFS).
 *
 * @context Used to create a "chroot jail" for the capability, restricting
 * what parts of the filesystem it can see and interact with.
 */
export const VfsPolicySchema = z.object({
  /**
   * A list of allowed URI schemes. If omitted, no schemes are allowed.
   * @example ["file", "s3", "git"]
   */
  allowed_schemes: z
    .array(z.enum(["file", "s3", "git", "http", "https"]))
    .default([]),

  /**
   * A list of path prefixes that the capability is allowed to read from or write to.
   * @example ["/workspace/data/", "/shared/"]
   */
  allowed_prefixes: z.array(z.string()).optional(),

  /**
   * A list of glob patterns for paths that are explicitly forbidden, even if
   * they fall under an allowed prefix.
   */
  deny_patterns: z.array(z.string()).optional(),
});

export type VfsPolicy = z.infer<typeof VfsPolicySchema>;

/**
 * The definitive security and resource contract for a capability.
 *
 * @context This schema is declared in a `capability.cx.yaml` manifest. The
 * executor capability (e.g., the Docker or Wasm runner) MUST read this policy
 * and configure the runtime sandbox to enforce these limits.
 *
 * @example
 * ```yaml
 * # In capability.cx.yaml
 * resource_policy:
 *   network_access: "private"
 *   cpu_request: "500m"  # Half a CPU core
 *   memory_request: "1Gi"
 *   max_execution_time: "10m"
 *   allowed_secrets: ["my-service-api-key"]
 *   vfs_policy:
 *     allowed_schemes: ["file", "s3"]
 *     allowed_prefixes: ["/workspace/input"]
 * ```
 */
export const ResourcePolicySchema = z.object({
  /**
   * The level of network access granted to the capability.
   * Defaults to 'none' for maximum security.
   */
  network_access: NetworkAccessSchema.default("none"),

  /**
   * The requested CPU resources, in Kubernetes format.
   * @example "1" (1 core), "500m" (0.5 cores)
   */
  cpu_request: z
    .string()
    .regex(
      /^\d+(\.\d+)?m?$/,
      "Must be a valid CPU quantity (e.g., '1' or '500m')."
    )
    .default("250m"),

  /**
   * The requested memory resources, in Kubernetes format.
   * @example "2Gi" (2 Gibibytes), "512Mi" (512 Mebibytes)
   */
  memory_request: z
    .string()
    .regex(
      /^\d+(\.\d+)?(Ki|Mi|Gi|Ti|Pi|Ei)?$/,
      "Must be a valid memory quantity (e.g., '512Mi')."
    )
    .default("512Mi"),

  /**
   * The maximum allowed execution time for the capability, in a simple duration format.
   * @example "5m" (5 minutes), "2h" (2 hours), "30s" (30 seconds)
   */
  max_execution_time: z
    .string()
    .regex(/^\d+[smh]$/, "Must be a valid duration string (e.g., '5m', '30s').")
    .default("5m"),

  /**
   * An explicit list of secret names that this capability is allowed to request
   * from the secrets service. Access to any other secret will be denied.
   */
  allowed_secrets: z.array(z.string()).default([]),

  /**
   * The filesystem access policy. If this is defined, the capability will
   * be provided with a VFS mount configured according to these rules.
   */
  vfs_policy: VfsPolicySchema.optional(),
});

export type ResourcePolicy = z.infer<typeof ResourcePolicySchema>;
