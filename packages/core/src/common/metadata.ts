/**
 * Domain 0: Common Primitives
 *
 * This file defines a common MetadataSchema to be composed into other resource
 * schemas for consistent auditing and organizational fields.
 *
 * @module common/metadata
 * @version 2.0.0
 */

import { z } from "zod";
import { TimestampSchema, UuidSchema } from "./primitives";

/**
 * A reusable schema for common metadata fields like timestamps and tags.
 * This should be composed into other schemas, not used directly.
 *
 * @context Used to add auditable, timestamped metadata to resources like
 * Documents, Connections, and Projects.
 *
 * @example
 * ```typescript
 * import { z } from "zod";
 * import { MetadataSchema } from "./metadata";
 *
 * const ProjectSchema = z.object({
 *   id: UuidSchema,
 *   name: z.string(),
 * }).merge(MetadataSchema); // Compose via .merge()
 *
 * const myProject = {
 *   id: "...",
 *   name: "My Project",
 *   created_at: "2024-11-08T15:00:00Z",
 *   updated_at: "2024-11-08T15:00:00Z",
 *   tags: ["analytics", "q4-report"]
 * };
 * ```
 */
export const MetadataSchema = z.object({
  /**
   * The ISO 8601 timestamp indicating when the resource was created.
   */
  created_at: TimestampSchema,

  /**
   * The ISO 8601 timestamp indicating when the resource was last updated.
   */
  updated_at: TimestampSchema,

  /**
   * An optional UUID of the user who created the resource.
   */
  created_by: UuidSchema.optional(),

  /**
   * A list of user-defined tags for organizing and filtering resources.
   */
  tags: z.array(z.string()).default([]),
});

export type Metadata = z.infer<typeof MetadataSchema>;
