import { AxiosError } from "axios";
import { ZodError } from "zod";

/** Normalised application error surfaced to the UI/query layer. */
export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** Convert any thrown value (Axios/Zod/unknown) into an ApiError. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string } | undefined;
    return new ApiError(data?.message ?? error.message, status, error.code);
  }

  if (error instanceof ZodError) {
    return new ApiError("Respons API tidak valid.", undefined, "VALIDATION");
  }

  return new ApiError(
    error instanceof Error ? error.message : "Terjadi kesalahan tak terduga."
  );
}
