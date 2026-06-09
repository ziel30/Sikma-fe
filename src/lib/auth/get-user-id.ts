import { SESSION_TOKEN_KEY } from "./cookies";

/** Decode userId from the stored JWT (client-side only). */
export function getUserId(): number | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.sub) || null;
  } catch {
    return null;
  }
}
