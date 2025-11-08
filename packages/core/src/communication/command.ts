/**
 * Domain 1: Communication Protocols
 *
 * This file defines the ClientCommandSchema, the standard envelope and
 * discriminated union for all client-to-server WebSocket messages.
 * These messages represent commands initiated by the user.
 *
 * @module communication/command
 * @version 2.0.0
 */

import { z } from "zod";
import { UuidSchema, TimestampSchema } from "../common/primitives";
import {
  BlockRunPayloadSchema,
  PageRunPayloadSchema,
  PageLoadPayloadSchema,
  PageSavePayloadSchema,
  AgentPromptPayloadSchema,
  CancelOperationPayloadSchema,
  WorkspaceBrowsePayloadSchema,
} from "./websocket/client-commands";

/**
 * The definitive discriminated union for all client-to-server commands (SCP).
 *
 * @context The WebSocket server's primary dispatcher will use this schema to
 * validate and parse every incoming message from a client like Studio.
 * The `type` field acts as the discriminator, allowing TypeScript to infer
 * the exact type of the `payload` object.
 *
 * @example
 * ```typescript
 * function handleClientCommand(command: ClientCommand) {
 *   switch (command.type) {
 *     case "BLOCK.RUN":
 *       // TypeScript knows command.payload is BlockRunPayload
 *       console.log("Running block:", command.payload.block_id);
 *       break;
 *     case "PAGE.LOAD":
 *       // TypeScript knows command.payload is PageLoadPayload
 *       console.log("Loading page:", command.payload.page_id);
 *       break;
 *   }
 * }
 * ```
 */
export const ClientCommandSchema = z.discriminatedUnion("type", [
  z.object({
    trace_id: UuidSchema,
    type: z.literal("BLOCK.RUN"),
    payload: BlockRunPayloadSchema,
    timestamp: TimestampSchema.optional(), // Making optional for flexibility, server can default
  }),
  z.object({
    trace_id: UuidSchema,
    type: z.literal("PAGE.RUN"),
    payload: PageRunPayloadSchema,
    timestamp: TimestampSchema.optional(),
  }),
  z.object({
    trace_id: UuidSchema,
    type: z.literal("PAGE.LOAD"),
    payload: PageLoadPayloadSchema,
    timestamp: TimestampSchema.optional(),
  }),
  z.object({
    trace_id: UuidSchema,
    type: z.literal("PAGE.SAVE"),
    payload: PageSavePayloadSchema,
    timestamp: TimestampSchema.optional(),
  }),
  z.object({
    trace_id: UuidSchema,
    type: z.literal("AGENT.PROMPT"),
    payload: AgentPromptPayloadSchema,
    timestamp: TimestampSchema.optional(),
  }),
  z.object({
    trace_id: UuidSchema,
    type: z.literal("OPERATION.CANCEL"),
    payload: CancelOperationPayloadSchema,
    timestamp: TimestampSchema.optional(),
  }),
  z.object({
    trace_id: UuidSchema,
    type: z.literal("WORKSPACE.BROWSE"),
    payload: WorkspaceBrowsePayloadSchema,
    timestamp: TimestampSchema.optional(),
  }),
]);

export type ClientCommand = z.infer<typeof ClientCommandSchema>;

/**
 * A type guard function to check if an unknown object is a valid ClientCommand.
 *
 * @param data The unknown data to check.
 * @returns True if the data conforms to the ClientCommandSchema.
 */
export function isClientCommand(data: unknown): data is ClientCommand {
  return ClientCommandSchema.safeParse(data).success;
}
