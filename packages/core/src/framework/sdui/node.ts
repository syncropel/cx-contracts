/**
 * Domain 4: UI Framework
 *
 * This file defines the core, recursive ComponentNode schema, which is the
 * fundamental building block of the Syncropel Server-Driven UI (SDUI) system.
 *
 * @module framework/sdui/node
 * @version 2.0.0
 */

import { z } from "zod";

/**
 * The recursive TypeScript type for an SDUI node.
 * This defines a tree structure where each node is a component with props
 * and can have other components as children.
 */
export type ComponentNode = {
  /** The unique identifier for the component to be rendered (e.g., "Table", "Card"). */
  component: string;
  /** A dictionary of properties to pass to the React component. */
  props?: Record<string, any>;
  /** An array of child ComponentNode objects. */
  children?: ComponentNode[];
  /** An optional key for efficient list rendering in React. */
  key?: string;
};

/**
 * The Zod schema for runtime validation of a ComponentNode.
 *
 * @context CSL (Contract Subset Language) forbids `z.lazy()` for recursion.
 * Therefore, `children` is typed as `z.array(z.any())`, and we rely on a
 * separate recursive validation function (`validateComponentNodeTree`) for deep validation.
 */
export const ComponentNodeSchema: z.ZodType<ComponentNode> = z.object({
  component: z.string().min(1),
  props: z.record(z.any()).optional(),
  children: z.array(z.any()).optional(),
  key: z.string().optional(),
});

/**
 * A recursive validation function for a complete ComponentNode tree.
 * This is the correct way to handle recursive validation while adhering to CSL.
 *
 * @param data The unknown data to validate as a ComponentNode tree.
 * @returns A validated ComponentNode tree.
 * @throws ZodError if validation fails at any level of the tree.
 */
export function validateComponentNodeTree(data: unknown): ComponentNode {
  const node = ComponentNodeSchema.parse(data);

  if (node.children) {
    // If children exist, recursively validate each one.
    node.children = node.children.map(validateComponentNodeTree);
  }

  return node;
}
