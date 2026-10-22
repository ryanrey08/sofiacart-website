import { apiClient, getData } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { LegalConsent, LegalDocument, PublishedLegalDocuments } from "@/types/domain";

export const legalService = {
  /** The published Terms and Privacy Policy; a document that is not published is `null`. */
  documents() {
    return getData<PublishedLegalDocuments>(apiEndpoints.legal.documents);
  },
  /** The file itself, streamed by the backend (only ever the published version). */
  async file(document: LegalDocument) {
    const { data } = await apiClient.get<Blob>(document.fileUrl, { responseType: "blob", timeout: 60000 });
    return data;
  },
  async consents() {
    return (await getData<{ consents: LegalConsent[] }>(apiEndpoints.legal.consents)).consents;
  },
};
