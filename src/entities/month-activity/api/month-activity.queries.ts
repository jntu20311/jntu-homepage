import {
  queryOptions,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchMonthActivities, fetchMonthActivity } from "./month-activity.api";

export const monthActivityKeys = {
  all: ["month-activity"] as const,
  list: (page: number, pageSize: number) =>
    [...monthActivityKeys.all, "list", page, pageSize] as const,
  detail: (id: string) => [...monthActivityKeys.all, "detail", id] as const,
};

export const monthActivitiesListQuery = (page: number, pageSize: number) =>
  queryOptions({
    queryKey: monthActivityKeys.list(page, pageSize),
    queryFn: () => fetchMonthActivities(page, pageSize),
    placeholderData: keepPreviousData,
  });

export const monthActivityQuery = (id: string | undefined) =>
  queryOptions({
    queryKey: monthActivityKeys.detail(id ?? ""),
    queryFn: () => fetchMonthActivity(id as string),
    enabled: Boolean(id),
  });

export const useMonthActivities = (page: number, pageSize: number) =>
  useQuery(monthActivitiesListQuery(page, pageSize));
export const useMonthActivity = (id: string | undefined) =>
  useQuery(monthActivityQuery(id));
