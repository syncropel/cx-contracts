/**
 * Domain 3: Data & Discovery
 *
 * Defines the ApiCatalogSchema (also known as a "Blueprint"), which is a declarative
 * manifest describing an external service.
 *
 * @module data/api_catalog
 * @version 2.0.0
 */

import { z } from "zod";

/**
 * Defines a single field for the interactive connection wizard in the UI.
 */
export const AuthFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["detail", "secret"]), // 'detail' is public, 'secret' is stored in the vault
  is_password: z.boolean().default(false),
});
export type AuthField = z.infer<typeof AuthFieldSchema>;

/**
 * Describes a complete authentication method supported by a blueprint.
 */
export const SupportedAuthMethodSchema = z.object({
  type: z.string().min(1),
  display_name: z.string().min(1),
  fields: z.array(AuthFieldSchema),
});
export type SupportedAuthMethod = z.infer<typeof SupportedAuthMethodSchema>;

/**
 * The definitive schema for a Blueprint (`blueprint.cx.yaml`).
 * It bridges a user-defined Connection to the Capability that implements it.
 */
export const ApiCatalogSchema = z.object({
  /** The unique, namespaced ID of the blueprint. e.g., "community/github@v1.0" */
  id: z.string().min(1),
  name: z.string().min(1),
  /** The unique ID of the BaseCapability plugin that implements this blueprint. */
  capability_id: z.string().min(1),
  description: z.string().optional(),
  docs_url: z.string().url().optional(),
  supported_auth_methods: z.array(SupportedAuthMethodSchema).default([]),
  /** A flexible dictionary for capability-specific configurations (e.g., API endpoints). */
  config: z.record(z.unknown()).default({}),
});
export type ApiCatalog = z.infer<typeof ApiCatalogSchema>;
