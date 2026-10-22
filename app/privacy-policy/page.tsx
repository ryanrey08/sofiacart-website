import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Data Privacy Policy",
  description: "The SofiaCart Buyer Data Privacy Policy currently in effect.",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-6 lg:py-10">
      <LegalDocumentPage type="privacy" />
    </Container>
  );
}
