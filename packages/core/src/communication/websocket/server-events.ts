/**
 * Domain 1: Communication Protocols
 *
 * This file defines the specific payload schemas for every event in the
 * Syncropel Event Protocol (SEP). Each schema corresponds to the `fields`
 * property within a `ServerEventPayload`.
 *
 * @module communication/websocket/server-events
 * @version 2.0.0
 */

import { z } from "zod";
import { UuidSchema, ExecutionStatusSchema } from "../../common/primitives";
import { ErrorSchema } from "../../common/error";
import { DataRefSchema, BlockOutputSchema } from "../../engine/workflow";
import { DocumentSchema } from "../../engine/document";

/**
 * Fields for a "BLOCK.OUTPUT" event, sent when a block completes successfully.
 */
export const BlockOutputFieldsSchema = z.object({
  block_id: z.string(),
  status: z.literal("success"),
  duration_ms: z.number().nonnegative(),
  output: BlockOutputSchema, // The hybrid "claim check" output
});
export type BlockOutputFields = z.infer<typeof BlockOutputFieldsSchema>;

/**
 * Fields for a "BLOCK.ERROR" event, sent when a block fails.
 */
export const BlockErrorFieldsSchema = z.object({
  block_id: z.string(),
  status: z.literal("error"),
  duration_ms: z.number().nonnegative(),
  error: ErrorSchema,
});
export type BlockErrorFields = z.infer<typeof BlockErrorFieldsSchema>;

/**
 * Fields for a "BLOCK.PROGRESS" event, for long-running blocks.
 */
export const BlockProgressFieldsSchema = z.object({
  block_id: z.string(),
  progress: z.number().min(0).max(100),
  status_message: z.string(),
});
export type BlockProgressFields = z.infer<typeof BlockProgressFieldsSchema>;

/**
 * An interactive action suggested by the AI agent.
 */
export const AgentSuggestedActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  command: z.record(z.unknown()), // This will be a full ClientCommand object
});
export type AgentSuggestedAction = z.infer<typeof AgentSuggestedActionSchema>;

/**
 * Fields for an "AGENT.RESPONSE" event, containing the AI's reply.
 */
export const AgentResponseFieldsSchema = z.object({
  /** The Markdown-formatted text content of the agent's message. */
  content: z.string(),
  /** An optional list of interactive buttons for the user to click. */
  actions: z.array(AgentSuggestedActionSchema).optional(),
});
export type AgentResponseFields = z.infer<typeof AgentResponseFieldsSchema>;

/**
 * Fields for a "PAGE.LOADED" event, sent after a successful page load.
 */
export const PageLoadedFieldsSchema = z.object({
  page_id: z.string(),
  /** The complete, raw content of the page in ".cx.md" format. */
  content: z.string(),
  /** The parsed Document model. */
  document: DocumentSchema,
});
export type PageLoadedFields = z.infer<typeof PageLoadedFieldsSchema>;

/**
 * Fields for a "WORKSPACE.CONTENT" event, responding to a browse command.
 */
export const WorkspaceContentFieldsSchema = z.object({
  path: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["file", "directory"]),
      path: z.string(),
    })
  ),
});
export type WorkspaceContentFields = z.infer<
  typeof WorkspaceContentFieldsSchema
>;
