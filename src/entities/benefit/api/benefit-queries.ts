import { queryOptions, useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBoardPreview } from "@/shared/api/board";
import { fetchBenefits, fetchBenefit } from "./benefit-api";

export const benefitKeys = {
  all: ["benefits"] as const,
  list: (page: number, pageSize: number) =>
    [...benefitKeys.all, "list", page, pageSize] as const,
  detail: (id: string) => [...benefitKeys.all, "detail", id] as const,
  preview: () => [...benefitKeys.all, "preview"] as const,
};

export const benefitsListQuery = (page: number, pageSize: number) =>
  queryOptions({
    queryKey: benefitKeys.list(page, pageSize),
    queryFn: () => fetchBenefits(page, pageSize),
    placeholderData: keepPreviousData,
  });

export const benefitQuery = (id: string | undefined) =>
  queryOptions({
    queryKey: benefitKeys.detail(id ?? ""),
    queryFn: () => fetchBenefit(id as string),
    enabled: Boolean(id),
  });

export const benefitsPreviewQuery = () =>
  queryOptions({
    queryKey: benefitKeys.preview(),
    queryFn: () => fetchBoardPreview("benefits", "created_at", 5),
  });

export const useBenefits = (page: number, pageSize: number) =>
  useQuery(benefitsListQuery(page, pageSize));
export const useBenefit = (id: string | undefined) => useQuery(benefitQuery(id));
export const useBenefitsPreview = () => useQuery(benefitsPreviewQuery());
