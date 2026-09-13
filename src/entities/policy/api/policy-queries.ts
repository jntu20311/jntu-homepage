import { queryOptions, useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPolicies, fetchPolicy } from "./policy-api";

export const policyKeys = {
  all: ["policy"] as const,
  list: (page: number, pageSize: number) =>
    [...policyKeys.all, "list", page, pageSize] as const,
  detail: (id: string) => [...policyKeys.all, "detail", id] as const,
};

export const policiesListQuery = (page: number, pageSize: number) =>
  queryOptions({
    queryKey: policyKeys.list(page, pageSize),
    queryFn: () => fetchPolicies(page, pageSize),
    placeholderData: keepPreviousData,
  });

export const policyQuery = (id: string | undefined) =>
  queryOptions({
    queryKey: policyKeys.detail(id ?? ""),
    queryFn: () => fetchPolicy(id as string),
    enabled: Boolean(id),
  });

export const usePolicies = (page: number, pageSize: number) =>
  useQuery(policiesListQuery(page, pageSize));
export const usePolicy = (id: string | undefined) => useQuery(policyQuery(id));
