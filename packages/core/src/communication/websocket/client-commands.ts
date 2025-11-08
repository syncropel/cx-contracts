/**
 * Domain 1: Communication Protocols
 *
 * This file defines the specific payload schemas for every command in the
 * Syncropel Command Protocol (SCP). Each schema corresponds to the `payload`
 * field of a `ClientCommand`.
 *
 * @module communication/websocket/client-commands
 * @version 2.0.0
 */

import { z } from "zod";
import { UuidSchema } from "../../common/primitives";

/**
 * Payload for the "BLOCK.RUN" command.
 * Sent when a client requests the execution of a single block.
 */
export const BlockRunPayloadSchema = z.object({
  /** The full ID of the page/document containing the block. */
  page_id: z.string().min(1),

  /** The ID of the specific block to execute. */
  block_id: z.string().min(1),

  /** Optional runtime parameters to pass to the block. */
  parameters: z.record(z.unknown()).default({}),

  /**
   * Optional override for the block's content. If provided, the engine will
   * execute this content instead of the version saved on disk.
   * @context Used for "live" execution from a dirty editor state.
   */
  content_override: z.string().optional(),
});
export type BlockRunPayload = z.infer<typeof BlockRunPayloadSchema>;

/**
 * Payload for the "PAGE.RUN" command.
 * Sent when a client requests the execution of an entire page/document.
 */
export const PageRunPayloadSchema = z.object({
  /** The full ID of the page/document to execute. */
  page_id: z.string().min(1),

  /** Global runtime parameters for the entire page run. */
  parameters: z.record(z.unknown()).default({}),

  /**
   * Optional list of specific block IDs to run. If omitted, the engine will
   * run all blocks in the document in their topological dependency order.
   */
  block_ids: z.array(z.string()).optional(),
});
export type PageRunPayload = z.infer<typeof PageRunPayloadSchema>;

/**
 * Payload for the "PAGE.LOAD" command.
 * Sent when a client needs to load the content and metadata of a page.
 */
export const PageLoadPayloadSchema = z.object({
  /**
   * The full, namespaced ID of the page to load.
   * @example "my-project/reports/q4-sales"
   */
  page_id: z.string().min(1),

  /**
   * Optional version or git commit hash to load.
   * If omitted, the latest version is loaded.
   */
  version: z.string().optional(),
});
export type PageLoadPayload = z.infer<typeof PageLoadPayloadSchema>;

/**
 * Payload for the "PAGE.SAVE" command.
 * Sent when a client wants to save changes to a page.
 */
export const PageSavePayloadSchema = z.object({
  /** The full ID of the page to save. */
  page_id: z.string().min(1),

  /** The complete, updated content of the page in ".cx.md" format. */
  content: z.string(),

  /** An optional commit message for the version history. */
  message: z.string().optional(),
});
export type PageSavePayload = z.infer<typeof PageSavePayloadSchema>;

/**
 * Payload for the "AGENT.PROMPT" command.
 * Sent when a user submits a message to the AI agent.
 */
export const AgentPromptPayloadSchema = z.object({
  /** The user's natural language prompt. */
  prompt: z.string().min(1),

  /** The ID of the page the user is currently viewing, providing context. */
  page_id: z.string().optional(),

  /**
   * An optional list of file paths to provide as additional context to the agent.
   * @example ["/data/sales.csv", "/analysis/previous_report.cx.md"]
   */
  context_paths: z.array(z.string()).optional(),
});
export type AgentPromptPayload = z.infer<typeof AgentPromptPayloadSchema>;

/**
 * Payload for the "OPERATION.CANCEL" command.
 * Sent when a client requests to stop a long-running execution.
 */
export const CancelOperationPayloadSchema = z.object({
  /** The `run_id` of the workflow execution to be cancelled. */
  run_id: UuidSchema,
});
export type CancelOperationPayload = z.infer<
  typeof CancelOperationPayloadSchema
>;

/**
 * Payload for the "WORKSPACE.BROWSE" command.
 * Sent to request a listing of files and directories.
 */
export const WorkspaceBrowsePayloadSchema = z.object({
  /** The path within the workspace to browse. An empty string denotes the root. */
  path: z.string().default(""),

  /** Optional filter to apply to the listing. */
  filter: z.enum(["pages", "data", "all"]).default("all"),

  /** Optional search query to find specific items. */
  query: z.string().optional(),
});
export type WorkspaceBrowsePayload = z.infer<
  typeof WorkspaceBrowsePayloadSchema
>;
