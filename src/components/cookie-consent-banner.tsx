'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { X, Cookie, Shield, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'kaffeine-cookies-acknowledged';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem(STORAGE_KEY);
    if (!acknowledged) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-[100] w-auto sm:w-[360px] sm:max-w-[calc(100vw-2rem)]"
        >
          <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/30">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>

            <div className="p-4 sm:p-5 pb-3 sm:pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Cookie size={18} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Your privacy matters</p>
                  <p className="text-[11px] text-muted-foreground/60">We keep it minimal</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                Kaffeine uses{' '}
                <span className="text-foreground font-medium">one strictly necessary cookie</span> for
                authentication. No tracking, no analytics, no third-party cookies — ever.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
                <button
                  onClick={dismiss}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all active:scale-[0.97] shadow-sm shadow-primary/20 min-h-[36px]"
                >
                  Got it
                  <ChevronRight size={13} />
                </button>
                <Link
                  href="/policy/cookies"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all min-h-[36px]"
                >
                  <Shield size={13} />
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="px-4 sm:px-5 py-2 sm:py-2.5 border-t border-border/40 bg-muted/30 rounded-b-2xl">
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50">
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-success inline-block" />
                  Strictly necessary
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-success inline-block" />
                  No third-party
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
