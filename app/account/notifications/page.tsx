import type { Metadata } from "next";

import { NotificationsPage } from "@/components/account/notifications-page";

export const metadata: Metadata = { title: "Notifications" };

export default function AccountNotificationsPage() {
  return <NotificationsPage />;
}
