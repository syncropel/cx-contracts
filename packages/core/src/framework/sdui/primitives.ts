/**
 * Domain 4: UI Framework
 *
 * Defines the schemas for fundamental, primitive SDUI components.
 *
 * @module framework/sdui/primitives
 * @version 2.0.0
 */

import { z } from "zod";

export const ButtonComponentSchema = z.object({
  label: z.string(),
  variant: z
    .enum(["primary", "secondary", "danger", "ghost"])
    .default("primary"),
  onClick: z.object({
    action: z.string(), // The SCP command to dispatch, e.g., "BLOCK.RUN"
    payload: z.record(z.any()).optional(),
  }),
});

export const TextInputComponentSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  value: z.string().default(""),
  bindTo: z.string(), // The state variable this input is bound to
});

export const SelectComponentSchema = z.object({
  label: z.string().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })),
  value: z.string().optional(),
  bindTo: z.string(),
});

export const TextComponentSchema = z.object({
  content: z.string(), // Supports Markdown
  variant: z.enum(["body", "heading", "caption", "code"]).default("body"),
});

export const ImageComponentSchema = z.object({
  src: z.string().url(),
  alt: z.string().optional(),
});
