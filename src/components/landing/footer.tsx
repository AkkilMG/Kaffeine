'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GitBranch, ExternalLink, Heart } from 'lucide-react';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/assets/logo/logo-nbg.png" alt="Kaffeine" width={28} height={28} className="size-6" />
              <span className="text-base font-bold text-foreground">Kaffeine</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Free and open-source uptime monitoring. Keep your services awake with Kaffeine.
            </p>
            <Link
              href="https://github.com/akkilmg/kaffeine"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <GitBranch size={14} className="transition-transform duration-300 group-hover:scale-110" />
              GitHub
            </Link>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="https://github.com/akkilmg/kaffeine"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  GitHub <ExternalLink size={10} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/akkilmg/kaffeine/issues"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Report Issue <ExternalLink size={10} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/akkilmg/kaffeine/blob/main/LICENSE"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  MIT License <ExternalLink size={10} />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/policy/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policy/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policy/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            &copy; {year} Kaffeine. Released under the{' '}
            <Link
              href="https://github.com/akkilmg/kaffeine/blob/main/LICENSE"
              target="_blank"
              className="text-primary hover:underline"
            >
              MIT License
            </Link>
            .
          </p>
          <p className="text-xs text-muted-foreground/50 flex items-center gap-1">
            Built with <Heart size={10} className="text-destructive" /> for the open source community
          </p>
        </div>
      </div>
    </footer>
  );
}
