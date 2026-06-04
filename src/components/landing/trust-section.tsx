'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Code, CheckCircle, GitBranch, ArrowRight, Lock, FileCode } from 'lucide-react';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/components/landing/animations';

export default function TrustSection() {
  return (
    <section className="relative py-24 md:py-32 bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 60%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <motion.div variants={slideInLeft} className="lg:col-span-2">
              <div className="text-sm font-medium text-primary font-mono mb-4">/trust</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-foreground">
                Open source.{' '}
                <span className="text-primary">Always.</span>
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Kaffeine is 100% open source under the MIT license. Every line of code is available
                  for you to inspect, contribute to, or self-host.
                </p>
                <p>
                  Your connection URIs and sensitive data are AES-256 encrypted before they ever touch
                  our database. Zero-knowledge monitoring — you control your data, always.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="https://github.com/akkilmg/kaffeine" target="_blank">
                  <Button className="gap-2 group/btn">
                    <GitBranch size={16} />
                    View Source
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="gap-2 group/btn">
                    Start Monitoring{' '}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={slideInRight} className="lg:col-span-3 space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                    <Lock size={16} className="text-success" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Encryption at Rest</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    'AES-256 encrypted connection strings',
                    'SHA-256 hashed passwords',
                    'HTTP-only session cookies',
                    'No plaintext secrets stored',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle size={12} className="text-success shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCode size={16} className="text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Open Source Stack</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    'MIT Licensed — free to use, modify, distribute',
                    'Next.js + TypeScript + Tailwind CSS',
                    'Cloudflare Workers for distributed checks',
                    'MongoDB for scalable data storage',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle size={12} className="text-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
