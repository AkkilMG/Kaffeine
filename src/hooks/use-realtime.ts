'use client';

import { useEffect, useRef } from 'react';

export type StatusUpdateEvent = {
  type: 'status-update';
  kaffeinerId: string;
  userId: string;
  status: boolean;
  time: string;
};

export type KaffeinerChangeEvent = {
  type: 'kaffeiner-change';
  action: 'create' | 'delete' | 'update';
  userId: string;
  kaffeinerId: string;
};

export type UserChangeEvent = {
  type: 'user-change';
  action: 'create' | 'delete' | 'role-change';
  userId?: string;
};

export type SystemEvent = {
  type: 'connected' | 'heartbeat';
  message?: string;
  time?: string;
};

export type RealtimeEvent = StatusUpdateEvent | KaffeinerChangeEvent | UserChangeEvent | SystemEvent;

interface UseRealtimeOptions {
  kaffeinerId?: string;
  onStatusUpdate?: (event: StatusUpdateEvent) => void;
  onKaffeinerChange?: (event: KaffeinerChangeEvent) => void;
  onUserChange?: (event: UserChangeEvent) => void;
  onEvent?: (event: RealtimeEvent) => void;
  enabled?: boolean;
}

export function useRealtime(options: UseRealtimeOptions) {
  const {
    kaffeinerId,
    onStatusUpdate,
    onKaffeinerChange,
    onUserChange,
    onEvent,
    enabled = true,
  } = options;

  const onStatusUpdateRef = useRef(onStatusUpdate);
  const onKaffeinerChangeRef = useRef(onKaffeinerChange);
  const onUserChangeRef = useRef(onUserChange);
  const onEventRef = useRef(onEvent);

  useEffect(() => { onStatusUpdateRef.current = onStatusUpdate; }, [onStatusUpdate]);
  useEffect(() => { onKaffeinerChangeRef.current = onKaffeinerChange; }, [onKaffeinerChange]);
  useEffect(() => { onUserChangeRef.current = onUserChange; }, [onUserChange]);
  useEffect(() => { onEventRef.current = onEvent; }, [onEvent]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttempts = useRef(0);

  const connectRef = useRef<(() => void) | null>(null);
  const enabledRef = useRef(enabled);
  const kaffeinerIdRef = useRef(kaffeinerId);

  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { kaffeinerIdRef.current = kaffeinerId; }, [kaffeinerId]);

  useEffect(() => {
    connectRef.current = () => {
      if (!enabledRef.current) return;

      const params = new URLSearchParams();
      if (kaffeinerIdRef.current) {
        params.set('kaffeinerId', kaffeinerIdRef.current);
      }
      const query = params.toString();
      const url = `/api/realtime${query ? `?${query}` : ''}`;

      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data: RealtimeEvent = JSON.parse(event.data);
          if (data.type === 'heartbeat' || data.type === 'connected') return;

          onEventRef.current?.(data);

          switch (data.type) {
            case 'status-update':
              onStatusUpdateRef.current?.(data);
              break;
            case 'kaffeiner-change':
              onKaffeinerChangeRef.current?.(data);
              break;
            case 'user-change':
              onUserChangeRef.current?.(data);
              break;
          }
        } catch {
          // Ignore parse errors
        }
      };

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;

        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current += 1;

        reconnectTimeoutRef.current = setTimeout(() => {
          connectRef.current?.();
        }, delay);
      };

      es.onopen = () => {
        reconnectAttempts.current = 0;
      };
    };
  }, []);

  useEffect(() => {
    const cleanup = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };

    cleanup();
    connectRef.current?.();

    return cleanup;
  }, [enabled, kaffeinerId]);
}
