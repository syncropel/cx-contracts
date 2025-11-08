/**
 * Domain 2: Computational Engine
 *
 * This file defines the RunManifestSchema, the immutable receipt of an execution.
 *
 * @module engine/run_manifest
 * @version 2.0.0
 */

import { z } from "zod";
import {
  UuidSchema,
  TimestampSchema,
  ExecutionStatusSchema,
} from "../common/primitives";
import { StepResultSchema } from "./workflow"; // Simplified for manifest

/**
 * Metadata for a single file artifact produced during a run.
 */
export const ManifestArtifactSchema = z.object({
  content_hash: z.string(),
  mime_type: z.string(),
  size_bytes: z.number().int().nonnegative(),
  type: z.string().default("primary_output"),
});
export type ManifestArtifact = z.infer<typeof ManifestArtifactSchema>;

/**
 * The definitive schema for the auditable record of a workflow execution.
 */
export const RunManifestSchema = z
  .object({
    run_id: UuidSchema,
    flow_id: z.string().min(1),
    status: ExecutionStatusSchema,
    timestamp_utc: TimestampSchema,
    duration_total_ms: z.number().int().nonnegative(),
    parameters: z.record(z.unknown()),
    steps: z.record(StepResultSchema),
    artifacts: z.record(ManifestArtifactSchema).default({}),
  })
  .strict();
export type RunManifest = z.infer<typeof RunManifestSchema>;
