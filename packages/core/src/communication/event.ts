/**
 * Domain 1: Communication Protocols
 *
 * This file defines the ServerEventSchema, the standard envelope and
 * discriminated union for all server-to-client WebSocket messages.
 * These messages represent events pushed from the server to the client.
 *
 * @module communication/event
 * @version 2.0.0
 */

import { z } from "zod";
import {
  UuidSchema,
  TimestampSchema,
  SeveritySchema,
} from "../common/primitives";
import {
  BlockOutputFieldsSchema,
  BlockErrorFieldsSchema,
  BlockProgressFieldsSchema,
  AgentResponseFieldsSchema,
  PageLoadedFieldsSchema,
  WorkspaceContentFieldsSchema,
} from "./websocket/server-events";

/**
 * The standard payload wrapper for all server-to-client events.
 * It provides consistent metadata like severity and a human-readable message.
 */
export const ServerEventPayloadSchema = z.object({
  level: SeveritySchema,
  message: z.string(),
  /**
   * The structured, machine-readable data for the event. The shape of this
   * object is determined by the parent event's `type`.
   */
  fields: z.record(z.unknown()).optional(),
});
export type ServerEventPayload = z.infer<typeof ServerEventPayloadSchema>;

/**
 * The definitive discriminated union for all server-to-client events (SEP).
 *
 * @context The client's WebSocket handler will use this schema to validate and
 * parse every incoming message from the server.
 */
export const ServerEventSchema = z.discriminatedUnion("type", [
  z.object({
    trace_id: UuidSchema,
    id: UuidSchema,
    type: z.literal("BLOCK.OUTPUT"),
    source: z.string(),
    timestamp: TimestampSchema,
    payload: ServerEventPayloadSchema.extend({
      fields: BlockOutputFieldsSchema,
    }),
  }),
  z.object({
    trace_id: UuidSchema,
    id: UuidSchema,
    type: z.literal("BLOCK.ERROR"),
    source: z.string(),
    timestamp: TimestampSchema,
    payload: ServerEventPayloadSchema.extend({
      fields: BlockErrorFieldsSchema,
    }),
  }),
  z.object({
    trace_id: UuidSchema,
    id: UuidSchema,
    type: z.literal("BLOCK.PROGRESS"),
    source: z.string(),
    timestamp: TimestampSchema,
    payload: ServerEventPayloadSchema.extend({
      fields: BlockProgressFieldsSchema,
    }),
  }),
  z.object({
    trace_id: UuidSchema,
    id: UuidSchema,
    type: z.literal("AGENT.RESPONSE"),
    source: z.string(),
    timestamp: TimestampSchema,
    payload: ServerEventPayloadSchema.extend({
      fields: AgentResponseFieldsSchema,
    }),
  }),
  z.object({
    trace_id: UuidSchema,
    id: UuidSchema,
    type: z.literal("PAGE.LOADED"),
    source: z.string(),
    timestamp: TimestampSchema,
    payload: ServerEventPayloadSchema.extend({
      fields: PageLoadedFieldsSchema,
    }),
  }),
  z.object({
    trace_id: UuidSchema,
    id: UuidSchema,
    type: z.literal("WORKSPACE.CONTENT"),
    source: z.string(),
    timestamp: TimestampSchema,
    payload: ServerEventPayloadSchema.extend({
      fields: WorkspaceContentFieldsSchema,
    }),
  }),
]);
export type ServerEvent = z.infer<typeof ServerEventSchema>;

/**
 * A type guard function to check if an unknown object is a valid ServerEvent.
 * @param data The unknown data to check.
 * @returns True if the data conforms to the ServerEventSchema.
 */
export function isServerEvent(data: unknown): data is ServerEvent {
  return ServerEventSchema.safeParse(data).success;
}
