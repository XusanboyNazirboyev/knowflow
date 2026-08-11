/**
 * Query client — React Query global config.
 * Stale time 1 daqiqa — tez-tez refetch bo'lmasin.
 */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
