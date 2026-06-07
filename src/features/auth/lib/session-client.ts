import { SESSION_COOKIE, SESSION_TOKEN_KEY } from "@/lib/auth/cookies";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Persist a session client-side: a cookie (read by middleware) + a token in
 * localStorage (sent by the Axios client). Placeholder until real auth tokens
 * come from the backend.
 */
export function setSession(token = "dev-token") {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}
