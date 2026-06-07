import axios from "axios";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/auth/cookies";
import { env } from "@/lib/env";

import { toApiError } from "./error-handler";

/**
 * Axios instance for Server Components / Route Handlers. Reads the session
 * cookie so requests are authenticated server-side.
 */
export async function serverApi() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  const instance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(toApiError(error))
  );

  return instance;
}
