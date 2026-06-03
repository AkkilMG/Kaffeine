import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useDashboardMetrics() {
  const { data, error, isLoading } = useSWR('/api/dashboard/metrics', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000,
  });
  return { metrics: data, loading: isLoading, error };
}

export function useKaffeiners() {
  const { data, error, isLoading, mutate } = useSWR('/api/kaffeiners', fetcher, {
    revalidateOnFocus: false,
  });
  return { kaffeiners: data || [], loading: isLoading, error, mutate };
}

export function useKaffeinerStats(kaffeinerId: string) {
  const { data, error, isLoading } = useSWR(
    kaffeinerId ? `/api/kaffeiners/${kaffeinerId}/stats` : null,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );
  return { stats: data, loading: isLoading, error };
}
