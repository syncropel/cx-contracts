/**
 * Domain 1: Communication Protocols - Public API
 *
 * This barrel file re-exports all schemas related to the Syncropel
 * Communication Protocols (SCP and SEP), providing a single entry point
 * for consumers of these contracts.
 *
 * @module communication
 * @version 2.0.0
 *
 * @example
 * ```typescript
 * import { ClientCommandSchema, ServerEventSchema } from '@syncropel/cx-contracts/communication';
 * ```
 */

export * from "./command";
export * from "./event";
export * from "./websocket/client-commands";
export * from "./websocket/server-events";
