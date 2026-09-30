import axios, { AxiosError, AxiosHeaders } from "axios";

import { env } from "@/lib/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiErrorResponse } from "@/types/api";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 10000,
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
    if (error.response?.status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearSession();
    }

    const message = error.response?.data.message ?? error.message;

    return Promise.reject(
      new ApiClientError(message, error.response?.status, error.response?.data.errors)
    );
  }
);
