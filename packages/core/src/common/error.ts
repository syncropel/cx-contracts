/**
 * Domain 0: Common Primitives
 *
 * This file defines the standardized ErrorSchema for all error responses across
 * the Syncropel platform. Using a consistent error structure is critical for
 * reliable error handling in clients, logs, and audit trails.
 *
 * @module common/error
 * @version 2.0.0
 */

import { z } from "zod";

/**
 * A standardized, machine-readable error object.
 *
 * @context Used in HTTP error responses, WebSocket SEP error events, and the
 * `error` field of a failed StepResult.
 *
 * @example
 * ```typescript
 * const validationError: Error = {
 *   code: "VALIDATION_FAILED",
 *   message: "Input validation failed for block 'load_data'.",
 *   details: {
 *     field: "username",
 *     reason: "String must contain at least 3 character(s)"
 *   },
 *   statusCode: 400
 * };
 * ```
 */
export const ErrorSchema = z.object({
  /**
   * A machine-readable, SCREAMING_SNAKE_CASE error code that clients can use
   * for programmatic error handling.
   * @example "BLOCK_EXECUTION_FAILED", "AUTHENTICATION_REQUIRED"
   */
  code: z.string().min(1, "Error code cannot be empty."),

  /**
   * A human-readable message describing the error. This message is safe to
   * display to end-users.
   */
  message: z.string().min(1, "Error message cannot be empty."),

  /**
   * An optional, structured object containing additional context about the
   * error. This can include things like field names, validation rules, etc.
   */
  details: z.record(z.unknown()).optional(),

  /**
   * An optional stack trace or detailed debugging information.
   * This field should ONLY be populated in development environments and
   * MUST be stripped in production for security reasons.
   */
  traceback: z.string().optional(),

  /**
   * An optional HTTP status code associated with this error (e.g., 400, 404, 500).
   */
  statusCode: z.number().int().min(400).max(599).optional(),
});

export type Error = z.infer<typeof ErrorSchema>;
