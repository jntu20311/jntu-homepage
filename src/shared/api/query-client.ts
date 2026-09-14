import { QueryClient } from "@tanstack/react-query";

/** 공개(사용자) 사이트 전용 QueryClient. (관리자 Refine 은 자체 client 사용) */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
