/**
 * Domain 2: Computational Engine
 *
 * This file defines schemas related to the results of a workflow execution.
 *
 * @module engine/workflow
 * @version 2.0.0
 */

import { z } from "zod";
import { UuidSchema, ExecutionStatusSchema } from "../common/primitives";
import { ErrorSchema } from "../common/error";

/**
 * The "Claim Check" for a large data artifact stored in a VFS.
 */
export const DataRefSchema = z.object({
  artifact_id: UuidSchema,
  access_url: z.string().url(),
  renderer_hint: z.string(),
  metadata: z.record(z.unknown()).optional(),
});
export type DataRef = z.infer<typeof DataRefSchema>;

/**
 * The hybrid output from a block, which can be small (inline) or large (a reference).
 */
export const BlockOutputSchema = z
  .object({
    inline_data: z.unknown().optional(),
    data_ref: DataRefSchema.optional(),
  })
  .strict()
  .refine(
    (data) => data.inline_data !== undefined || data.data_ref !== undefined,
    {
      message: "Output must have either 'inline_data' or 'data_ref'",
    }
  );
export type BlockOutput = z.infer<typeof BlockOutputSchema>;

/**
 * The definitive, structured return object for a single step's execution.
 */
export const StepResultSchema = z.object({
  status: ExecutionStatusSchema,
  summary: z.string(),
  duration_ms: z.number().int().nonnegative(),
  output: BlockOutputSchema.optional(),
  error: ErrorSchema.optional(),
  artifacts: z
    .array(
      z.object({
        name: z.string(),
        path: z.string(),
      })
    )
    .default([]),
});
export type StepResult = z.infer<typeof StepResultSchema>;
