/**
 * Domain 4: UI Framework
 * Defines contracts for loading remote microfrontends via Module Federation.
 * @module framework/federation
 * @version 2.0.0
 */

import { z } from "zod";

export const RemoteModuleConfigSchema = z.object({
  name: z.string(), // The unique name of the remote app
  url: z.string().url(), // The URL to the remoteEntry.js file
  scope: z.string(), // The webpack federation scope
  module: z.string(), // The module to import (e.g., "./MyComponent")
});
export type RemoteModuleConfig = z.infer<typeof RemoteModuleConfigSchema>;

export const FederationManifestSchema = z.object({
  remotes: z.record(RemoteModuleConfigSchema),
});
export type FederationManifest = z.infer<typeof FederationManifestSchema>;
