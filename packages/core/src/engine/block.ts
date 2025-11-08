/**
 * Domain 2: Computational Engine
 *
 * This file defines the BlockSchema, the atomic, executable unit within a Document.
 *
 * @module engine/block
 * @version 2.0.0
 */

import { z } from "zod";
import { ResourcePolicySchema } from "../common/resource-policy"; // Using the full schema is better practice

/**
 * A simplified schema for resource limits for backward compatibility,
 * but we will use the more detailed one from resource-policy.
 */
export const ResourceLimitsSchema = z.object({
  max_execution_time: z.string().optional(),
  memory_request: z.string().optional(),
  cpu_request: z.string().optional(),
});
export type ResourceLimits = z.infer<typeof ResourceLimitsSchema>;

/**
 * Resource access declaration for locking and preventing race conditions.
 */
export const ResourceAccessSchema = z.object({
  reads: z.array(z.string()).default([]),
  writes: z.array(z.string()).default([]),
});
export type ResourceAccess = z.infer<typeof ResourceAccessSchema>;

/**
 * The definitive schema for a single, executable block.
 */
export const BlockSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z_][a-zA-Z0-9_-]*$/, "Must be a valid identifier"),
    name: z.string().optional(),
    engine: z.string().optional(),
    connection: z.string().optional(),
    run: z.record(z.unknown()).optional(),
    content: z.string().optional(),
    inputs: z.array(z.string()).default([]),
    outputs: z.union([z.array(z.string()), z.record(z.string())]).optional(),
    depends_on: z.array(z.string()).optional(),
    if: z.string().optional(), // Using quotes to allow 'if' as a key
    resource_policy: ResourcePolicySchema.optional(), // Use the full, correct schema
    resources: ResourceAccessSchema.optional(),
    metadata: z.record(z.unknown()).default({}),
  })
  .strict()
  .refine((data) => !(data.engine && data.connection), {
    message: "Block must specify either 'engine' or 'connection', not both",
    path: ["engine"],
  });

export type Block = z.infer<typeof BlockSchema>;
