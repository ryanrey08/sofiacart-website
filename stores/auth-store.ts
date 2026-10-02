import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthTokens, User } from "@/types/domain";

export type SessionEndReason = "expired" | "deactivated" | null;

interface AuthState {
  accessToken: string | null;
  expiresAt: string | null;
  user: User | null;
  isAuthenticated: boolean;
  /** Why the last session ended without the customer logging out (shown on the login page). */
  sessionEndReason: SessionEndReason;
  setSession: (payload: { tokens: AuthTokens; user: User }) => void;
  setUser: (user: User) => void;
  clearSession: (reason?: SessionEndReason) => void;
  acknowledgeSessionEnd: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
      sessionEndReason: null,
      setSession: ({ tokens, user }) =>
        set({
          accessToken: tokens.accessToken,
          expiresAt: tokens.expiresAt ?? null,
          user,
          isAuthenticated: true,
          sessionEndReason: null,
        }),
      setUser: (user) => set({ user }),
      clearSession: (reason = null) =>
        set({
          accessToken: null,
          expiresAt: null,
          user: null,
          isAuthenticated: false,
          sessionEndReason: reason,
        }),
      acknowledgeSessionEnd: () => set({ sessionEndReason: null }),
    }),
    {
      name: "sofiacart-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionEndReason: state.sessionEndReason,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.expiresAt && new Date(state.expiresAt).getTime() <= Date.now()) {
          state.clearSession("expired");
        }
      },
    }
  )
);
