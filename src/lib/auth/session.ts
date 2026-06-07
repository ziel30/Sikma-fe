import { cookies } from "next/headers";

import { SESSION_COOKIE } from "./cookies";

/** Read the session token from cookies (Server Components / Route Handlers). */
export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}
