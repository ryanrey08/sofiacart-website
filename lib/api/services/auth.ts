import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiEnvelope } from "@/types/api";
import type { AddressInput, AuthTokens, User } from "@/types/domain";

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  /** Registration only: false when the verification email could not be sent. */
  verificationEmailSent?: boolean;
}

/** Parameters of an emailed verification link (FRONTEND_URL/verify-email?id=&hash=&expires=&signature=). */
export interface VerificationLink {
  id: string;
  hash: string;
  expires: string;
  signature: string;
}

export type VerifyEmailStatus = "verified" | "already_verified";

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
  /** Resend to the signed-in customer's own email address. */
  async resendVerification() {
    const { data } = await apiClient.post<ApiEnvelope<object>>(apiEndpoints.auth.resendVerification);
    return data.message;
  },
  /** Signed-out resend, by email address or from an expired link. The reply never reveals whether an account exists. */
  async resendVerificationPublic(payload: { email: string } | VerificationLink) {
    const { data } = await apiClient.post<ApiEnvelope<object>>(apiEndpoints.auth.resendVerificationPublic, payload);
    return data.message;
  },
  /** The backend checks the link's signature, expiry and account before marking the email verified. */
  async verifyEmail(link: VerificationLink) {
    const { data } = await apiClient.post<ApiEnvelope<{ status: VerifyEmailStatus }>>(apiEndpoints.auth.verifyEmail, link);
    return { status: data.data.status, message: data.message };
  },
};
