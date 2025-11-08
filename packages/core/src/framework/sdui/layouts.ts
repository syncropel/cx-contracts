/**
 * Domain 4: UI Framework
 *
 * Defines the schemas for layout and container SDUI components.
 *
 * @module framework/sdui/layouts
 * @version 2.0.0
 */

import { z } from "zod";

export const CardComponentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

export const FlexComponentSchema = z.object({
  direction: z.enum(["row", "column"]).default("row"),
  gap: z.number().default(4),
  justify: z.enum(["start", "center", "end", "between"]).default("start"),
  align: z.enum(["start", "center", "end", "stretch"]).default("start"),
});

export const GridComponentSchema = z.object({
  columns: z.number().int().positive().default(1),
  gap: z.number().default(4),
});

export const StackComponentSchema = z.object({
  spacing: z.number().default(4),
});

export const TabsComponentSchema = z.object({
  tabs: z.array(z.object({ key: z.string(), label: z.string() })),
});
