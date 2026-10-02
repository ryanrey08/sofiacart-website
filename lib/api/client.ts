import axios, { AxiosError, AxiosHeaders } from "axios";

import { env } from "@/lib/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiEnvelope, ApiErrorResponse } from "@/types/api";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
  }

  /** First validation message for a field (Laravel 422 `errors`). */
  fieldError(field: string) {
    return this.errors?.[field]?.[0];
  }
}

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const nextHeaders =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    nextHeaders.set("Authorization", "Bearer " + accessToken);
  }

  config.headers = nextHeaders;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;

    if (typeof window !== "undefined") {
      const { accessToken, clearSession } = useAuthStore.getState();

      // 401: token expired or revoked. 403 on a deactivated account also deletes the token server-side.
      if (status === 401 && accessToken) {
        clearSession("expired");
      } else if (status === 403 && accessToken && error.response?.data?.message?.includes("deactivated")) {
        clearSession("deactivated");
      }
    }

    let message = error.response?.data?.message ?? error.message;

    if (!error.response) {
      message = "We couldn't reach SofiaCart. Check your connection and try again.";
    } else if (status === 429) {
      message = "Too many attempts. Please wait a moment and try again.";
    } else if (status && status >= 500) {
      message = "Something went wrong on our side. Please try again.";
    }

    return Promise.reject(new ApiClientError(message, status, error.response?.data?.errors));
  }
);

/** Unwraps the `{ data }` envelope used by customer endpoints. */
export async function getData<T>(url: string, params?: object): Promise<T> {
  const response = await apiClient.get<ApiEnvelope<T>>(url, { params });
  return response.data.data;
}

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error instanceof ApiClientError) {
    const firstFieldError = error.errors ? Object.values(error.errors)[0]?.[0] : undefined;
    // Laravel's 422 message only repeats the first error ("... (and 1 more error)").
    return error.status === 422 && firstFieldError ? firstFieldError : error.message;
  }

  return error instanceof Error ? error.message : fallback;
}
