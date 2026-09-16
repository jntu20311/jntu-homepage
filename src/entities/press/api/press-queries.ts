import {
  queryOptions,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchBoardPreview } from "@/shared/api/board";
import { fetchPressList, fetchPress } from "./press-api";

export const pressKeys = {
  all: ["press"] as const,
  list: (page: number, pageSize: number) =>
    [...pressKeys.all, "list", page, pageSize] as const,
  detail: (id: string) => [...pressKeys.all, "detail", id] as const,
  preview: () => [...pressKeys.all, "preview"] as const,
};

export const pressListQuery = (page: number, pageSize: number) =>
  queryOptions({
    queryKey: pressKeys.list(page, pageSize),
    queryFn: () => fetchPressList(page, pageSize),
    placeholderData: keepPreviousData,
  });

export const pressQuery = (id: string | undefined) =>
  queryOptions({
    queryKey: pressKeys.detail(id ?? ""),
    queryFn: () => fetchPress(id as string),
    enabled: Boolean(id),
  });

export const pressPreviewQuery = () =>
  queryOptions({
    queryKey: pressKeys.preview(),
    queryFn: () => fetchBoardPreview("press", "press_date", 5, "schedule"),
  });

export const usePressList = (page: number, pageSize: number) =>
  useQuery(pressListQuery(page, pageSize));
export const usePress = (id: string | undefined) => useQuery(pressQuery(id));
export const usePressPreview = () => useQuery(pressPreviewQuery());
