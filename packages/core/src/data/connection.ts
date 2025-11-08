/**
 * Domain 3: Data & Discovery
 *
 * Defines the ConnectionSchema, representing a user's configured instance of an external service.
 *
 * @module data/connection
 * @version 2.0.0
 */

import { z } from "zod";
import { UuidSchema, TimestampSchema } from "../common/primitives";

/**
 * The base schema for a connection, representing the user-editable fields in a `.conn.yaml` file.
 */
export const ConnectionBaseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  /** The ID of the ApiCatalog (Blueprint) this connection implements. e.g., "community/github@v1.0" */
  api_catalog_id: z.string().min(1),
  /** The chosen authentication method type from the blueprint. */
  auth_method_type: z.string().min(1),
  /** Non-sensitive configuration details like server URL, database name, etc. */
  details: z.record(z.unknown()).default({}),
  tags: z.array(z.string()).default([]),
});
export type ConnectionBase = z.infer<typeof ConnectionBaseSchema>;

/**
 * The full, in-memory representation of a Connection, including server-managed fields.
 */
export const ConnectionSchema = ConnectionBaseSchema.extend({
  /** The unique, user-defined ID for this connection. e.g., "user:prod-db" */
  id: z.string().min(1),
  /** The user or organization that owns this connection. */
  owner_id: UuidSchema.optional(),
  /** Path to the credentials in a secure vault. */
  vault_secret_path: z.string().optional(),
  /** The connection's health status. */
  status: z
    .enum(["untested", "active", "failed", "disabled"])
    .default("untested"),
  last_tested_at: TimestampSchema.optional(),
  created_at: TimestampSchema,
  updated_at: TimestampSchema,
});
export type Connection = z.infer<typeof ConnectionSchema>;
