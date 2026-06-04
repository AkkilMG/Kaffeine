'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' as const } },
  open: { opacity: 1, height: 'auto' as const, transition: { duration: 0.3, ease: 'easeInOut' as const } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 20);
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-muted/20">
        <motion.div
          className="h-full bg-primary/70"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Image
                  src="/assets/logo/logo-nbg.png"
                  alt="Kaffeine"
                  width={32}
                  height={32}
                  className="size-9"
                />
              </motion.div>
              <span className="text-lg font-bold text-foreground">Kaffeine</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </motion.button>
              )}
              <div className="hidden md:flex items-center gap-3">
                {!loading && user ? (
                  <Link href="/dashboard">
                    <Button size="sm" className="gap-2 group/btn">
                      Dashboard{' '}
                      <ChevronRight
                        size={14}
                        className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button size="sm" className="gap-2 group/btn shadow-lg shadow-primary/20">
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
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
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
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-border flex flex-col gap-2">
                  {!loading && user ? (
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2">
                        Dashboard <ChevronRight size={14} />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full gap-2 shadow-lg shadow-primary/20">
                          Get Started <ChevronRight size={14} />
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
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
