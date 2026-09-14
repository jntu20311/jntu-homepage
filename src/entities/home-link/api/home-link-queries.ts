import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchHomeLinks } from "./home-link-api";

export const homeLinkKeys = {
  all: ["home_links"] as const,
  list: () => [...homeLinkKeys.all, "list"] as const,
};

export const homeLinksQuery = () =>
  queryOptions({
    queryKey: homeLinkKeys.list(),
    queryFn: fetchHomeLinks,
  });

export const useHomeLinks = () => useQuery(homeLinksQuery());
