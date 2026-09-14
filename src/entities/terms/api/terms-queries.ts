import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchTermsVersions } from "./terms-api";
import type { TermsSlug } from "../model/types";

export const termsKeys = {
  all: ["terms"] as const,
  versions: (slug: TermsSlug) => [...termsKeys.all, "versions", slug] as const,
};

export const termsVersionsQuery = (slug: TermsSlug) =>
  queryOptions({
    queryKey: termsKeys.versions(slug),
    queryFn: () => fetchTermsVersions(slug),
    staleTime: 1000 * 60 * 5, // 약관은 자주 변경되지 않음
  });

export const useTermsVersions = (slug: TermsSlug) =>
  useQuery(termsVersionsQuery(slug));
