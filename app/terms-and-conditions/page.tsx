import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The SofiaCart Buyer Terms and Conditions currently in effect.",
};

export default function TermsAndConditionsPage() {
  return (
    <Container className="py-6 lg:py-10">
      <LegalDocumentPage type="terms" />
    </Container>
  );
}
