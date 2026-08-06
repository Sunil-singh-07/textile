import { QueryClient } from '@tanstack/react-query';

// Error toasts are already handled centrally in the axios response
// interceptor (api/axiosClient.js), so query/mutation defaults here stay
// focused on caching behaviour only — no onError here to avoid double-toasting.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute — most catalog/dashboard data doesn't need to refetch aggressively
      retry: (failureCount, error) => {
        // Don't retry auth/permission/validation failures — retrying a 401/403/400
        // just repeats the same error and re-fires the toast.
        if ([400, 401, 403, 404, 409].includes(error?.status)) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
