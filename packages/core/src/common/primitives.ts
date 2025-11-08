/**
 * Domain 0: Common Primitives
 *
 * This file contains the definitive, universal data types used throughout the
 * entire Syncropel ecosystem. These are the atomic building blocks for all
 * other contracts.
 *
 * @module common/primitives
 * @version 2.0.0
 */

import { z } from "zod";

/**
 * A string representing a complete ISO 8601 datetime with timezone information.
 * All timestamps in the system MUST use this format to ensure consistency.
 *
 * @context Used for all `created_at`, `updated_at`, and event timestamps.
 * @example "2024-11-08T14:30:00.123Z"
 * @example "2024-11-08T09:30:00-05:00"
 */
export const TimestampSchema = z.string().datetime({
  message:
    "Invalid ISO 8601 datetime format. Expected format: YYYY-MM-DDTHH:mm:ss.sssZ",
});
export type Timestamp = z.infer<typeof TimestampSchema>;

/**
 * A string representing a universally unique identifier (UUID) as defined by RFC 4122.
 *
 * @context Used as the primary key for most resources (runs, blocks, users, etc.).
 * @example "550e8400-e29b-41d4-a716-446655440000"
 */
export const UuidSchema = z.string().uuid({
  message: "Invalid UUID format.",
});
export type Uuid = z.infer<typeof UuidSchema>;

/**
 * A string representing a Semantic Version (SemVer) 2.0.0.
 *
 * @context Used for package versions, capability versions, and schema versions.
 * @example "2.3.1"
 * @example "3.0.0-beta.2"
 */
export const VersionSchema = z
  .string()
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
    "Must be a valid SemVer string."
  );
export type Version = z.infer<typeof VersionSchema>;

/**
 * A string representing a generic, platform-agnostic file path.
 * Should use forward slashes as separators.
 *
 * @context Used for VFS paths and local file references.
 * @example "/home/user/project/file.txt"
 * @example "relative/path/to/data.csv"
 */
export const FilePathSchema = z.string().min(1, "File path cannot be empty.");
export type FilePath = z.infer<typeof FilePathSchema>;

/**
 * A string representing a fully qualified URL.
 *
 * @context Used for API endpoints, WebSocket URLs, and external resource links.
 * @example "https://api.syncropel.com/v1"
 * @example "wss://app.syncropel.com/ws"
 */
export const UrlSchema = z.string().url({ message: "Invalid URL format." });
export type Url = z.infer<typeof UrlSchema>;

/**
 * The standardized execution status for any computational unit.
 *
 * @context Used to track the state of Blocks, Workflow Runs, and Jobs.
 */
export const ExecutionStatusSchema = z.enum([
  "pending", // Queued for execution, has not yet started.
  "running", // Actively executing.
  "success", // Completed without errors.
  "failed", // Terminated due to an error.
  "skipped", // Execution was skipped due to a conditional (`if:`).
  "cancelled", // Execution was manually stopped by a user or system.
]);
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;

/**
 * The standardized severity level for logs, errors, and UI notifications.
 *
 * @context Used in logging, audit trails, and SEP events.
 */
export const SeveritySchema = z.enum([
  "debug",
  "info",
  "warn",
  "error",
  "critical",
]);
export type Severity = z.infer<typeof SeveritySchema>;

/**
 * The publication ring in the Three-Ring Model of CI/CD.
 *
 * @context Used in version metadata to track the stability level of a contract release.
 * @see docs/cdrs/cdr-004-three-ring-safety.md
 */
export const RingSchema = z.enum(["preview", "canary", "stable"]);
export type Ring = z.infer<typeof RingSchema>;
