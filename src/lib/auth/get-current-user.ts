import { serverApi } from "@/lib/api/server-client";
import type { MyProfile } from "@/features/profile/api";

/**
 * Resolve the current user server-side by calling GET /learn/profile/me.
 * Returns null if unauthenticated or the request fails.
 */
export async function getCurrentUser(): Promise<MyProfile | null> {
  try {
    const api = await serverApi();
    const { data } = await api.get<MyProfile>("/learn/profile/me");
    return data ?? null;
  } catch {
    return null;
  }
}
