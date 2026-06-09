import { SESSION_COOKIE, SESSION_ROLE_KEY, SESSION_TOKEN_KEY } from "@/lib/auth/cookies";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Persist a session client-side: a cookie (read by middleware) + a token in
 * localStorage (sent by the Axios client). The user's role is stored too so the
 * UI can show/hide admin areas (the API still enforces access server-side).
 */
export function setSession(token = "dev-token", roles = 0) {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
  window.localStorage.setItem(SESSION_ROLE_KEY, String(roles));
}

export function clearSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
  window.localStorage.removeItem(SESSION_ROLE_KEY);
}

/** Read the stored role (0 if unknown / signed out). */
export function getStoredRole(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(SESSION_ROLE_KEY) ?? 0);
}

export function isAdmin(): boolean {
  return getStoredRole() >= 1;
}
