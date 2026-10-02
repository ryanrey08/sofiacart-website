import type { Metadata } from "next";

import { MyReviews } from "@/components/account/my-reviews";

export const metadata: Metadata = { title: "My Reviews" };

export default function ReviewsPage() {
  return <MyReviews />;
}
