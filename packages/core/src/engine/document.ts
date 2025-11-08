/**
 * Domain 2: Computational Engine
 *
 * This file defines the DocumentSchema, representing a complete ".cx.md" file.
 *
 * @module engine/document
 * @version 2.0.0
 */

import { z } from "zod";
import { BlockSchema } from "./block";

/**
 * Schema for a document's input parameter definition.
 */
export const DocumentInputSchema = z.object({
  description: z.string().optional(),
  type: z.string().default("string"),
  required: z.boolean().default(false),
  default: z.unknown().optional(),
});
export type DocumentInput = z.infer<typeof DocumentInputSchema>;

/**
 * The definitive schema for a complete, executable Document.
 */
export const DocumentSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    inputs: z.record(DocumentInputSchema).default({}),
    blocks: z.array(BlockSchema).min(1),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    metadata: z.record(z.unknown()).default({}),
  })
  .strict();

export type Document = z.infer<typeof DocumentSchema>;
