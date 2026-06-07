import { z } from "zod";

/** Validated environment variables. Fails fast (at import) if misconfigured. */
const schema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:4000/api"),
});

export const env = schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
