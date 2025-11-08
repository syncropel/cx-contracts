/**
 * Domain 3: Data & Discovery
 *
 * Defines schemas for capability metadata and function discovery.
 *
 * @module data/capability
 * @version 2.0.0
 */

import { z } from "zod";

/**
 * The self-describing "tool" signature for a single function advertised by a Capability.
 * This is the contract presented to AI agents and used for UI generation.
 */
export const FunctionSignatureSchema = z.object({
  /** Fully qualified function name. e.g., "system:git.clone_repo" */
  name: z.string().min(1),
  /** A clear, natural language description of what the function does. */
  description: z.string().min(1),
  /** A JSON Schema object defining the function's input parameters. */
  input_schema: z.record(z.unknown()),
  /** An optional JSON Schema object describing the function's output. */
  output_schema: z.record(z.unknown()).optional(),
});
export type FunctionSignature = z.infer<typeof FunctionSignatureSchema>;

/**
 * The complete metadata for a discovered capability, as stored in the registry.
 */
export const CapabilityDefinitionSchema = z.object({
  /** The unique capability ID. e.g., "system:python" */
  id: z.string().min(1),
  description: z.string().min(1),
  /** How the capability is executed. e.g., 'python_class', 'container' */
  runtime: z.string(),
  /** Where to find the capability. e.g., 'my_module:MyClass' or a Docker image URI */
  entry_point: z.string().min(1),
  functions: z.array(FunctionSignatureSchema),
});
export type CapabilityDefinition = z.infer<typeof CapabilityDefinitionSchema>;
