'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon } from 'lucide-react';

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/assets/logo/logo-nbg.png" alt="Kaffeine" width={28} height={28} className="size-8" />
            <span className="text-base font-bold text-foreground">Kaffeine</span>
          </Link>

          <div className="flex items-center gap-3">
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <Link href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        {children}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kaffeine. Released under the{' '}
            <Link href="https://github.com/akkilmg/kaffeine/blob/main/LICENSE" target="_blank"
              className="text-primary hover:underline">MIT License</Link>.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/policy/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/policy/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/policy/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
