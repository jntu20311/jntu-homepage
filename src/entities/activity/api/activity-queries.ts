import { queryOptions, useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBoardPreview } from "@/shared/api/board";
import { fetchActivities, fetchActivity } from "./activity-api";

export const activityKeys = {
  all: ["activities"] as const,
  list: (page: number, pageSize: number) =>
    [...activityKeys.all, "list", page, pageSize] as const,
  detail: (id: string) => [...activityKeys.all, "detail", id] as const,
  preview: () => [...activityKeys.all, "preview"] as const,
};

export const activitiesListQuery = (page: number, pageSize: number) =>
  queryOptions({
    queryKey: activityKeys.list(page, pageSize),
    queryFn: () => fetchActivities(page, pageSize),
    placeholderData: keepPreviousData,
  });

export const activityQuery = (id: string | undefined) =>
  queryOptions({
    queryKey: activityKeys.detail(id ?? ""),
    queryFn: () => fetchActivity(id as string),
    enabled: Boolean(id),
  });

export const activitiesPreviewQuery = () =>
  queryOptions({
    queryKey: activityKeys.preview(),
    queryFn: () => fetchBoardPreview("activities", "created_at", 5),
  });

export const useActivities = (page: number, pageSize: number) =>
  useQuery(activitiesListQuery(page, pageSize));
export const useActivity = (id: string | undefined) =>
  useQuery(activityQuery(id));
export const useActivitiesPreview = () => useQuery(activitiesPreviewQuery());
