import { z } from "zod";

import type { Materi, PathNode } from "./types";

/**
 * Zod schemas validating the courses API responses. Typed as `ZodType<T>` so
 * they stay structurally in sync with the domain types in `./types`.
 */
export const pathNodeSchema: z.ZodType<PathNode> = z.object({
  id: z.string(),
  kind: z.enum(["lesson", "chest", "trophy"]),
  status: z.enum(["done", "current", "locked"]),
  title: z.string().optional(),
  xp: z.number().optional(),
});

export const courseSchema: z.ZodType<Materi> = z.object({
  slug: z.string(),
  label: z.string(),
  subtitle: z.string(),
  tone: z.enum(["yellow", "pink"]),
  nodes: z.array(pathNodeSchema),
  next: z.object({ slug: z.string(), hint: z.string() }).optional(),
});

export const coursesSchema = z.array(courseSchema);
