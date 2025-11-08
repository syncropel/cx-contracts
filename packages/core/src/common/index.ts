/**
 * Domain 0: Common Primitives - Public API
 *
 * This barrel file re-exports all schemas from the 'common' domain, providing a
 * single, clean entry point for other parts of the contract system and for
 * external consumers.
 *
 * @module common
 * @version 2.0.0
 *
 * @example
 * ```typescript
 * // Cleanly import multiple schemas from the common domain
 * import { UuidSchema, ErrorSchema, ResourcePolicySchema } from '@syncropel/cx-contracts/common';
 * ```
 */

export * from "./primitives";
export * from "./error";
export * from "./metadata";
export * from "./resource-policy";
