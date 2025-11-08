/**
 * Domain 4: UI Framework
 * Defines contracts for the frontend plugin system.
 * @module framework/plugin
 * @version 2.0.0
 */

import { z } from "zod";

/**
 * Defines the manifest for a frontend UI plugin, typically found in a plugin's `plugin.json`.
 */
export const PluginManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(), // SemVer
  description: z.string().optional(),
  author: z.string().optional(),
  main: z.string(), // Path to the entry point script
  contributes: z
    .object({
      sduiComponents: z
        .array(
          z.object({
            component: z.string(), // e.g., "my-plugin:MyCustomChart"
            displayName: z.string(),
          })
        )
        .optional(),
      commands: z
        .array(
          z.object({
            command: z.string(),
            title: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

// Interfaces for runtime, not Zod schemas
export interface Disposable {
  dispose(): void;
}
export interface PluginContext {
  subscriptions: Disposable[];
  // ... other APIs for plugins to use
}
