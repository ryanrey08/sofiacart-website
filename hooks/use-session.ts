"use client";

import { useSyncExternalStore } from "react";

import { useAuthStore } from "@/stores/auth-store";

const subscribeNoop = () => () => {};

/**
 * False during server rendering and hydration, true afterwards. Browser-persisted stores (auth
 * token, guest cart) are only read once this is true so the first client render matches the server.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

export function useSession() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated && Boolean(state.accessToken));

  return {
    hydrated,
    user: hydrated ? user : null,
    isAuthenticated: hydrated && isAuthenticated,
  };
}
