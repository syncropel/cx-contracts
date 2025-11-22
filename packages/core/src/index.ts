/**
 * @syncropel/cx-contracts - The Definitive, Machine-Readable Contracts
 *
 * This is the main entry point for the core contracts package. It exports the
 * most commonly used schemas and types from all conceptual domains.
 *
 * For a complete list of all schemas, import from the specific domain barrel file.
 *
 * @module @syncropel/cx-contracts
 * @version 2.0.0
 *
 * @example
 * ```typescript
 * // Import common schemas directly from the root
 * import { BlockSchema, UserSchema, ServerEventSchema } from '@syncropel/cx-contracts';
 *
 * // For more specific schemas, import from the domain
 * import { TableComponentSchema } from '@syncropel/cx-contracts/framework/sdui';
 * ```
 */

// Export all domain barrels for granular access
export * as common from "./common";
export * as communication from "./communication";
export * as engine from "./engine";
export * as data from "./data";
export * as framework from "./framework";
export * as agent from "./agent";
export * as migrations from "./migrations";

// --- Re-export the most important, top-level schemas for convenience ---

// Common Primitives
export * from "./common/primitives";
export * from "./common/error";
export * from "./common/metadata";
export * from "./common/resource-policy";

// Communication Protocols
export * from "./communication/command";
export * from "./communication/event";

// Core Engine Concepts
export * from "./engine/block";
export * from "./engine/document";
export * from "./engine/workflow";
export * from "./engine/run_manifest";
export * from "./engine/context";

// Data & Discovery
export * from "./data/connection";
export * from "./data/blueprint";
export * from "./data/capability";

// UI Framework (SDUI)
export * from "./framework/sdui/node";

// Agent
export * from "./agent/agent";
