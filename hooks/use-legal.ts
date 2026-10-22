"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { legalService } from "@/lib/api/services/legal";

/** Published Terms and Privacy Policy. Short-lived so a newly published version shows promptly. */
export function useLegalDocuments() {
  return useQuery({
    queryKey: queryKeys.legal.documents,
    queryFn: legalService.documents,
    staleTime: 60 * 1000,
  });
}
