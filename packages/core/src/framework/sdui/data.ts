/**
 * Domain 4: UI Framework
 *
 * Defines the schemas for data visualization and display SDUI components.
 *
 * @module framework/sdui/data
 * @version 2.0.0
 */

import { z } from "zod";

export const TableComponentSchema = z.object({
  data: z.array(z.record(z.any())),
  columns: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
    })
  ),
});

export const ChartComponentSchema = z.object({
  type: z.enum(["line", "bar", "pie"]),
  data: z.array(z.record(z.any())),
  config: z.record(z.any()), // Library-specific config (e.g., for Recharts)
});

export const MetricComponentSchema = z.object({
  label: z.string(),
  value: z.string(),
  change: z.string().optional(),
});

export const JsonComponentSchema = z.object({
  data: z.any(),
});

export const MarkdownComponentSchema = z.object({
  content: z.string(),
});
