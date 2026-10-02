import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiEnvelope } from "@/types/api";
import type { AddressInput, AuthTokens, User } from "@/types/domain";

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
  passwordConfirmation: string;
  shippingAddress?: AddressInput | null;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}

const deviceName = "SofiaCart Web";

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>(apiEndpoints.auth.login, {
      ...payload,
      deviceName,
    });
    return data.data;
  },
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>(apiEndpoints.auth.register, {
      ...payload,
      deviceName,
    });
    return data.data;
  },
  async me() {
    return (await getData<{ user: User }>(apiEndpoints.auth.me)).user;
  },
  async logout() {
    await apiClient.post(apiEndpoints.auth.logout);
  },
  async logoutAll() {
    await apiClient.post(apiEndpoints.auth.logoutAll);
  },
  async forgotPassword(email: string) {
    const { data } = await apiClient.post<ApiEnvelope<object>>(apiEndpoints.auth.forgotPassword, { email });
    return data.message;
  },
  async resetPassword(payload: ResetPasswordPayload) {
    const { data } = await apiClient.post<ApiEnvelope<object>>(apiEndpoints.auth.resetPassword, payload);
    return data.message;
  },
  async resendVerification() {
    const { data } = await apiClient.post<ApiEnvelope<object>>(apiEndpoints.auth.resendVerification);
    return data.message;
  },
};
