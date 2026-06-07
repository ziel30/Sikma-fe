import { getValidated } from "@/lib/api/client";

import { courseSchema, coursesSchema } from "./schemas";
import type { Materi } from "./types";

/**
 * Courses API — the canonical "consume API with Axios + Zod" pattern. Every
 * call validates the response against a schema before returning typed data.
 * Replicate this shape (`schemas.ts` + `api.ts` + `hooks/`) per feature.
 */
export const coursesApi = {
  list: () => getValidated<Materi[]>("/courses", coursesSchema),
  getBySlug: (slug: string) =>
    getValidated<Materi>(`/courses/${slug}`, courseSchema),
};
