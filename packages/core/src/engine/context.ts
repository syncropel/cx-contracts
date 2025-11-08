/**
 * Domain 2: Computational Engine
 *
 * This file defines the RunContextSchema, the object passed to every capability.
 *
 * @module engine/context
 * @version 2.0.0
 */

import { z } from "zod";
import { UuidSchema, FilePathSchema } from "../common/primitives";
import { BlockSchema } from "./block";

/**
 * The immutable context object passed to every capability during execution.
 * SDK services like 'vfs' and 'secrets' are injected at runtime and are not
 * part of the serialized schema.
 */
export const RunContextSchema = z
  .object({
    run_id: UuidSchema,
    flow_id: z.string().min(1),
    cx_home: FilePathSchema,
    piped_input: z.unknown().optional(),
    script_input: z.record(z.unknown()).default({}),
    steps: z.record(z.unknown()).default({}),
    session: z.record(z.unknown()).default({}),
    current_flow_path: FilePathSchema.optional(),
    current_block: BlockSchema.optional(),
  })
  .strict();
export type RunContext = z.infer<typeof RunContextSchema>;
