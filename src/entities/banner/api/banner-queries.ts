import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchBanners } from "./banner-api";

export const bannerKeys = {
  all: ["banners"] as const,
  list: () => [...bannerKeys.all, "list"] as const,
};

export const bannersQuery = () =>
  queryOptions({
    queryKey: bannerKeys.list(),
    queryFn: fetchBanners,
  });

export const useBanners = () => useQuery(bannersQuery());
