/**
 * Tiny localStorage-backed flag so the onboarding questionnaire only runs the
 * first time, right after a user registers. Swap for real user state once a
 * backend exists.
 */
const ONBOARDED_KEY = "sikma:onboarded";

export function isOnboarded(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ONBOARDED_KEY) === "1";
}

export function markOnboarded(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDED_KEY, "1");
}

/** Reset the flag so onboarding runs again — called on a fresh registration. */
export function clearOnboarded(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDED_KEY);
}
