/**
 * Domain 5: Agent & Intelligence
 *
 * This file defines the core schemas for AI agent interactions, including the
 * representation of tools, conversational messages, and the agent's memory.
 *
 * @module agent/agent
 * @version 2.0.0
 */

import { z } from "zod";
import { FunctionSignatureSchema } from "../data/capability"; // Re-using for tool definition

/**
 * Represents an agent's decision to call a specific tool (function) with a
 * given set of arguments.
 */
export const ToolCallSchema = z.object({
  /** The fully qualified name of the function to call. e.g., "system:git.clone_repo" */
  function_name: z.string().min(1),
  /** A dictionary of arguments to pass to the function, conforming to its input_schema. */
  parameters: z.record(z.unknown()),
});
export type ToolCall = z.infer<typeof ToolCallSchema>;

/**
 * A single message in an agent's conversational history or thought process.
 */
export const MessageSchema = z.object({
  /** The role of the entity that produced the message. */
  role: z.enum(["user", "assistant", "system", "tool"]),
  /** The textual content of the message. */
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

/**
 * The structured result of a tool execution, which is fed back to the agent as an observation.
 */
export const ObservationSchema = z.object({
  /** The name of the tool that was called. */
  tool_name: z.string(),
  /** The input parameters that were provided to the tool. */
  tool_input: z.record(z.unknown()),
  /** The output returned by the tool execution. */
  output: z.unknown(),
  /** The status of the tool execution. */
  status: z.enum(["success", "failure"]),
});
export type Observation = z.infer<typeof ObservationSchema>;

/**
 * The agent's "working memory" or state for a given task.
 * This structure supports various reasoning models like ReAct (Reasoning + Acting).
 */
export const BeliefsSchema = z.object({
  /** The original, high-level goal provided by the user. */
  initial_goal: z.string(),
  /**
   * The chronological history of the agent's thought process, including
   * messages, tool calls, and observations. This forms the short-term memory.
   */
  history: z
    .array(z.union([MessageSchema, ToolCallSchema, ObservationSchema]))
    .default([]),
  /**
   * A key-value store for structured facts the agent has learned or extracted.
   * This can serve as a form of long-term memory for the task.
   */
  facts: z.record(z.unknown()).default({}),
});
export type Beliefs = z.infer<typeof BeliefsSchema>;
