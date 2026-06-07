import { getSessionToken } from "./session";

/**
 * Resolve the current user server-side. Placeholder until the backend exists —
 * once wired, fetch `/me` via `serverApi()` and validate with a Zod schema:
 *
 *   const api = await serverApi();
 *   return UserSchema.parse((await api.get("/me")).data);
 */
export async function getCurrentUser() {
  const token = await getSessionToken();
  if (!token) return null;
  return { token } as const;
}
