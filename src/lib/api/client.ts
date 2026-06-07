import axios from "axios";
import type { ZodType } from "zod";

import { SESSION_TOKEN_KEY } from "@/lib/auth/cookies";
import { env } from "@/lib/env";

import { toApiError } from "./error-handler";

/**
 * Browser-side Axios instance. Attaches the bearer token and normalises errors.
 * For Server Components use `serverApi()` from `./server-client` instead.
 */
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(SESSION_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

/** GET a URL and validate the response body against a Zod schema. */
export async function getValidated<T>(
  url: string,
  schema: ZodType<T>
): Promise<T> {
  const { data } = await apiClient.get(url);
  return schema.parse(data);
}

/** POST a body and validate the response against a Zod schema. */
export async function postValidated<T>(
  url: string,
  body: unknown,
  schema: ZodType<T>
): Promise<T> {
  const { data } = await apiClient.post(url, body);
  return schema.parse(data);
}
