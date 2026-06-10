'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sun, Moon, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
];

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: 'easeInOut' as const },
  },
  open: {
    opacity: 1,
    height: 'auto' as const,
    transition: { duration: 0.3, ease: 'easeInOut' as const },
  },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest - lastScrollY.current;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrolled(latest > 20);
    setHidden(direction > 0 && latest > 100);
    setScrollProgress(docHeight > 0 ? (latest / docHeight) * 100 : 0);
    lastScrollY.current = latest;
  });

  useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[1px] bg-muted/20">
        <motion.div
          className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/70 backdrop-blur-2xl border-b border-border/40 shadow-lg shadow-foreground/2'
            : 'bg-transparent'
        } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: -10, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <Image
                  src="/assets/logo/logo-nbg.png"
                  alt="Kaffeine"
                  width={32}
                  height={32}
                  className="size-9"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight leading-tight">Kaffeine</span>
                <span className="text-[9px] text-muted-foreground/40 leading-tight hidden sm:block">by Arkynox</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-primary/60 to-primary transition-all duration-300 group-hover/link:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </motion.button>
              )}
              <div className="hidden md:flex items-center gap-3">
                {!loading && user ? (
                  <Link href="/dashboard">
                    <Button size="sm" className="gap-2 group/btn relative overflow-hidden">
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      Dashboard{' '}
                      <ChevronRight
                        size={14}
                        className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button size="sm" className="gap-2 group/btn shadow-lg shadow-primary/15 relative overflow-hidden">
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      Get Started{' '}
                      <ChevronRight
                        size={14}
                        className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                    </Button>
                  </Link>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden border-t border-border/40 bg-background/80 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-4 py-4 sm:py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-border/40 flex flex-col gap-2.5">
                  {!loading && user ? (
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2 py-2.5">
                        Dashboard <ChevronRight size={14} />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full gap-2 py-2.5 shadow-lg shadow-primary/15">
                          Get Started <ChevronRight size={14} />
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full py-2.5">
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
