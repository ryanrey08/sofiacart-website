"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { queryKeys } from "@/lib/api/query-keys";
import { authService, type AuthResponse, type LoginPayload, type RegisterPayload } from "@/lib/api/services/auth";
import { cartService } from "@/lib/api/services/cart";
import { useSession } from "@/hooks/use-session";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "@/stores/toast-store";

/** Moves the guest cart into the customer's server cart after sign-in. */
async function mergeGuestCart(queryClient: QueryClient) {
  const items = useCartStore.getState().items;

  if (items.length === 0) return;

  try {
    const { cart, warnings } = await cartService.merge(
      items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity }))
    );
    useCartStore.getState().clearCart();
    queryClient.setQueryData(queryKeys.cart, cart);
    if (warnings.length > 0) {
      toast.info("Some cart items were adjusted", warnings.join(" "));
    }
  } catch {
    toast.error("We couldn't move your saved cart items", "They are still in your browser; try again from the cart.");
  }
}

function useCompleteSignIn() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return async (response: AuthResponse) => {
    queryClient.removeQueries({ queryKey: queryKeys.private });
    setSession(response);
    queryClient.setQueryData(queryKeys.me, response.user);
    await mergeGuestCart(queryClient);
  };
}

export function useLogin() {
  const completeSignIn = useCompleteSignIn();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: completeSignIn,
  });
}

export function useRegister() {
  const completeSignIn = useCompleteSignIn();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: completeSignIn,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: async ({ everywhere = false }: { everywhere?: boolean } = {}) => {
      try {
        await (everywhere ? authService.logoutAll() : authService.logout());
      } catch {
        // The token may already be expired; signing out locally is still correct.
      }
    },
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: queryKeys.private });
    },
  });
}

/**
 * Validates the stored token on load (`GET /auth/me`) and keeps the stored profile fresh. A 401
 * clears the session through the API client; private queries are dropped whenever the session ends.
 */
export function useAuthSync() {
  const queryClient = useQueryClient();
  const { isAuthenticated, hydrated } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  const me = useQuery({
    queryKey: queryKeys.me,
    queryFn: authService.me,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (me.data) setUser(me.data);
  }, [me.data, setUser]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      queryClient.removeQueries({ queryKey: queryKeys.private });
    }
  }, [hydrated, isAuthenticated, queryClient]);
}
