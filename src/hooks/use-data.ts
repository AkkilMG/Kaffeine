'use client';

import useSWR from 'swr';
import { useRealtime, type StatusUpdateEvent, type KaffeinerChangeEvent } from './use-realtime';
import { useCallback, useRef } from 'react';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export function useDashboardMetrics() {
  const { data, error, isLoading, mutate } = useSWR('/api/dashboard/metrics', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000,
  });

  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  useRealtime({
    onStatusUpdate: useCallback(() => {
      mutateRef.current();
    }, []),
    onKaffeinerChange: useCallback(() => {
      mutateRef.current();
    }, []),
  });

  return { metrics: data, loading: isLoading, error, mutate };
}

export function useKaffeiners() {
  const { data, error, isLoading, mutate } = useSWR('/api/kaffeiners', fetcher, {
    revalidateOnFocus: false,
  });

  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  useRealtime({
    onStatusUpdate: useCallback(() => {
      mutateRef.current();
    }, []),
    onKaffeinerChange: useCallback(() => {
      mutateRef.current();
    }, []),
  });

  return { kaffeiners: data || [], loading: isLoading, error, mutate };
}

export function useKaffeinerStats(kaffeinerId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    kaffeinerId ? `/api/kaffeiners/${kaffeinerId}/stats` : null,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );

  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  useRealtime({
    kaffeinerId,
    onStatusUpdate: useCallback((event: StatusUpdateEvent) => {
      if (event.kaffeinerId === kaffeinerId) {
        mutateRef.current();
      }
    }, [kaffeinerId]),
  });

  return { stats: data, loading: isLoading, error, mutate };
}

export function useAdminUsers() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/users', fetcher, {
    revalidateOnFocus: false,
  });

  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  useRealtime({
    onUserChange: useCallback(() => {
      mutateRef.current();
    }, []),
  });

  return { users: data || [], loading: isLoading, error, mutate };
}

export function useAdminKaffeiners() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/kaffeiners', fetcher, {
    revalidateOnFocus: false,
  });

  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  useRealtime({
    onStatusUpdate: useCallback(() => {
      mutateRef.current();
    }, []),
    onKaffeinerChange: useCallback(() => {
      mutateRef.current();
    }, []),
  });

  return { kaffeiners: data || [], loading: isLoading, error, mutate };
}

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/stats', fetcher, {
    revalidateOnFocus: false,
  });

  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  useRealtime({
    onStatusUpdate: useCallback(() => {
      mutateRef.current();
    }, []),
    onUserChange: useCallback(() => {
      mutateRef.current();
    }, []),
  });

  return { adminStats: data, loading: isLoading, error, mutate };
}
