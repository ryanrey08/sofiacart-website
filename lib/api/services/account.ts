import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiEnvelope, ListParams, PaginationMeta } from "@/types/api";
import type {
  AccountSession,
  AccountSettings,
  Address,
  AddressInput,
  CustomerNotification,
  Review,
  ReviewInput,
  User,
} from "@/types/domain";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string | null;
  email?: string;
  currentPassword?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export const accountService = {
  async profile() {
    return (await getData<{ user: User }>(apiEndpoints.account.profile)).user;
  },
  async updateProfile(payload: UpdateProfilePayload) {
    const { data } = await apiClient.patch<ApiEnvelope<{ user: User }>>(apiEndpoints.account.profile, payload);
    return data.data.user;
  },
  async updatePassword(payload: UpdatePasswordPayload) {
    const { data } = await apiClient.put<ApiEnvelope<object>>(apiEndpoints.account.password, payload);
    return data.message;
  },
  async settings() {
    return (await getData<{ settings: AccountSettings }>(apiEndpoints.account.settings)).settings;
  },
  async updateSettings(payload: Partial<AccountSettings>) {
    const { data } = await apiClient.patch<ApiEnvelope<{ settings: AccountSettings }>>(
      apiEndpoints.account.settings,
      payload
    );
    return data.data.settings;
  },
  async sessions() {
    return (await getData<{ sessions: AccountSession[] }>(apiEndpoints.account.sessions)).sessions;
  },
  async revokeSession(id: number) {
    await apiClient.delete(apiEndpoints.account.session(id));
  },
};

export const addressService = {
  async list() {
    return (await getData<{ addresses: Address[] }>(apiEndpoints.account.addresses)).addresses;
  },
  async create(payload: AddressInput) {
    const { data } = await apiClient.post<ApiEnvelope<{ address: Address }>>(apiEndpoints.account.addresses, payload);
    return data.data.address;
  },
  async update(id: number, payload: Partial<AddressInput>) {
    const { data } = await apiClient.patch<ApiEnvelope<{ address: Address }>>(apiEndpoints.account.address(id), payload);
    return data.data.address;
  },
  async remove(id: number) {
    await apiClient.delete(apiEndpoints.account.address(id));
  },
  async makeDefault(id: number) {
    const { data } = await apiClient.post<ApiEnvelope<{ address: Address }>>(apiEndpoints.account.defaultAddress(id));
    return data.data.address;
  },
};

export const reviewService = {
  async mine(params: ListParams = {}) {
    const { data } = await apiClient.get<ApiEnvelope<{ reviews: Review[] }>>(apiEndpoints.account.reviews, { params });
    return { items: data.data.reviews, meta: data.meta };
  },
  async create(slug: string, payload: ReviewInput) {
    const { data } = await apiClient.post<ApiEnvelope<{ review: Review }>>(apiEndpoints.catalog.reviews(slug), payload);
    return data.data.review;
  },
  async update(id: number, payload: Partial<ReviewInput>) {
    const { data } = await apiClient.patch<ApiEnvelope<{ review: Review }>>(apiEndpoints.account.review(id), payload);
    return data.data.review;
  },
  async remove(id: number) {
    await apiClient.delete(apiEndpoints.account.review(id));
  },
};

export interface NotificationsPage {
  notifications: CustomerNotification[];
  unreadCount: number;
  meta?: PaginationMeta;
}

export const notificationService = {
  async list(params: ListParams & { unread?: boolean } = {}): Promise<NotificationsPage> {
    const { data } = await apiClient.get<ApiEnvelope<{ notifications: CustomerNotification[]; unreadCount: number }>>(
      apiEndpoints.account.notifications,
      { params: { ...params, unread: params.unread ? 1 : undefined } }
    );
    return { ...data.data, meta: data.meta };
  },
  async unreadCount() {
    return (await getData<{ unreadCount: number }>(apiEndpoints.account.unreadNotifications)).unreadCount;
  },
  async markRead(id: string) {
    await apiClient.post(apiEndpoints.account.readNotification(id));
  },
  async markAllRead() {
    await apiClient.post(apiEndpoints.account.readAllNotifications);
  },
  async remove(id: string) {
    await apiClient.delete(apiEndpoints.account.notification(id));
  },
};
