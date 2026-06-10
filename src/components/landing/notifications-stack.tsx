'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'error' | 'success' | 'info';
  message: string;
}

const notifications: Notification[] = [
  { id: 1, type: 'error', message: 'example.com — 503 error' },
  { id: 2, type: 'success', message: 'app-staging — back online' },
  { id: 3, type: 'info', message: 'api.example.com — 12ms response' },
  { id: 4, type: 'success', message: 'All 2 services operational' },
  { id: 5, type: 'error', message: 'SSL cert expiring in 7 days' },
];

const iconMap = {
  error: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

const colorMap = {
  error: 'bg-destructive/10 border-destructive/30 text-destructive',
  success: 'bg-success/10 border-success/30 text-success',
  info: 'bg-primary/10 border-primary/30 text-primary',
};

export default function NotificationsStack() {
  const [items, setItems] = useState<Notification[]>([]);
  const [mounted, setMounted] = useState(false);

  const pushNotification = useCallback(() => {
    const notif = notifications[Math.floor(Math.random() * notifications.length)];
    const id = Date.now();
    setItems((prev) => [...prev.slice(-2), { ...notif, id }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    pushNotification();
    const interval = setInterval(pushNotification, 6000);
    return () => clearInterval(interval);
  }, [mounted, pushNotification]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-xs w-full">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => {
          const Icon = iconMap[item.type];
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.3 } }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                mass: 0.8,
              }}
              className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xl bg-background/80 ${colorMap[item.type]}`}
              style={{ marginTop: i > 0 ? -16 : 0 }}
            >
              <Icon size={14} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium leading-tight">
                  {item.type === 'error' ? 'Downtime Detected' : item.type === 'success' ? 'Recovery' : 'Info'}
                </p>
                <p className="text-[10px] opacity-80 mt-0.5 font-mono">{item.message}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
