"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // KHÔNG retry 401 — interceptor axios sẽ tự refresh token.
      // TanStack Query retry=1 sẽ retry tất cả errors (kể cả 401),
      // gây race condition: retry chạy TRƯỚC khi refresh xong.
      // Fix: dùng shouldRetryError để skip 401, interceptor sẽ handle.
      retry(failureCount, error) {
        if (failureCount >= 1) return false;
        const status = (error as any)?.response?.status;
        if (status === 401) return false;
        return true;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
