"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import {
  accountService,
  addressService,
  notificationService,
  reviewService,
  type UpdatePasswordPayload,
  type UpdateProfilePayload,
} from "@/lib/api/services/account";
import { useSession } from "@/hooks/use-session";
import { useAuthStore } from "@/stores/auth-store";
import type { ListParams } from "@/types/api";
import type { AccountSettings, AddressInput, ReviewInput } from "@/types/domain";

export function useAddresses() {
  const { isAuthenticated } = useSession();
  return useQuery({ queryKey: queryKeys.addresses, queryFn: addressService.list, enabled: isAuthenticated });
}

export function useSaveAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: AddressInput }) =>
      id ? addressService.update(id, payload) : addressService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useMakeDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.makeDefault(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => accountService.updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(queryKeys.me, user);
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => accountService.updatePassword(payload),
    // Other sessions are revoked by the backend.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
  });
}

export function useSettings() {
  const { isAuthenticated } = useSession();
  return useQuery({ queryKey: queryKeys.settings, queryFn: accountService.settings, enabled: isAuthenticated });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AccountSettings>) => accountService.updateSettings(payload),
    onSuccess: (settings) => queryClient.setQueryData(queryKeys.settings, settings),
  });
}

export function useSessions() {
  const { isAuthenticated } = useSession();
  return useQuery({ queryKey: queryKeys.sessions, queryFn: accountService.sessions, enabled: isAuthenticated });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.revokeSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
  });
}

export function useMyReviews(params: ListParams) {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: queryKeys.reviews(params),
    queryFn: () => reviewService.mine(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}

function useInvalidateReviews() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["me", "reviews"] });
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  };
}

export function useCreateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: ReviewInput }) => reviewService.create(slug, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ReviewInput> }) => reviewService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: (id: number) => reviewService.remove(id), onSuccess: invalidate });
}

export function useNotifications(params: ListParams & { unread?: boolean }) {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: queryKeys.notifications(params),
    queryFn: () => notificationService.list(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}

export function useUnreadNotifications() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: notificationService.unreadCount,
    enabled: isAuthenticated,
    refetchInterval: 60 * 1000,
  });
}

function useNotificationMutation<T>(fn: (input: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notificationsRoot }),
  });
}

export const useMarkNotificationRead = () => useNotificationMutation((id: string) => notificationService.markRead(id));
export const useMarkAllNotificationsRead = () => useNotificationMutation(() => notificationService.markAllRead());
export const useDeleteNotification = () => useNotificationMutation((id: string) => notificationService.remove(id));
