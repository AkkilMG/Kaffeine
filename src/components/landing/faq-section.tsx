'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import SplitText from '@/components/landing/split-text';

const faqs = [
  { q: 'What is Kaffeine?', a: 'Free and open-source uptime monitoring. Kaffeine periodically checks your websites and databases from 350+ global locations, alerting you immediately if something goes wrong.', category: 'General' },
  { q: 'Is Kaffeine really free?', a: 'Yes — completely free. No paid tiers, no hidden costs, no feature limitations. Every monitoring capability is available to every user.', category: 'Pricing' },
  { q: 'How is my data encrypted?', a: 'All sensitive data, including database connection URIs and credentials, are AES-256 encrypted before storage. Zero-knowledge architecture ensures your data stays yours.', category: 'Security' },
  { q: 'Can I self-host Kaffeine?', a: 'Absolutely. Kaffeine is 100% open source under the Apache License 2.0. You can inspect every line of code, contribute, or deploy on your own infrastructure anytime.', category: 'General' },
  { q: 'What services can I monitor?', a: 'Monitor any website via HTTP/HTTPS and databases — MongoDB, PostgreSQL, MySQL, Redis, and more. Native driver checks ensure accurate health status.', category: 'Features' },
  { q: 'Do I need a credit card?', a: 'No. Sign up with your email and start monitoring immediately. No payment information required, ever.', category: 'Pricing' },
  { q: 'How often are checks performed?', a: 'By default, checks run every 60 seconds from our global network of 350+ locations. You can adjust notification preferences per monitor.', category: 'Features' },
  { q: 'What alert channels do you support?', a: 'We support email, Slack, Discord, and custom webhooks. Configure multiple channels per monitor with granular notification rules.', category: 'General' },
];

const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <section id="faq" ref={sectionRef} className="relative py-24 md:py-32 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary font-mono mb-4 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">
            /faq
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            <SplitText text="Got questions? " mode="chars" />
            <SplitText text="We&apos;ve got answers." mode="chars" gradient />
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about Kaffeine. Can&apos;t find what you&apos;re looking for?
            Reach out.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-muted/30 border border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span
                  className={`ml-1.5 text-xs ${
                    activeCategory === cat
                      ? 'text-primary-foreground/60'
                      : 'text-muted-foreground/50'
                  }`}
                >
                  ({faqs.filter((f) => f.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((faq, i) => {
              const globalIndex = faqs.indexOf(faq);
              const isOpen = openIndex === globalIndex;
              return (
                <motion.div
                  key={faq.q}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`group rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-primary/40 bg-card shadow-lg shadow-primary/5'
                      : 'border-border/60 bg-card hover:border-primary/20 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${globalIndex}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-primary/15 scale-110'
                            : 'bg-muted/50 group-hover:bg-primary/5'
                        }`}
                      >
                        <span
                          className={`font-mono text-xs font-bold transition-colors duration-300 ${
                            isOpen ? 'text-primary' : 'text-muted-foreground/40'
                          }`}
                        >
                          {String(globalIndex + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="font-medium text-sm md:text-base lg:text-lg text-foreground truncate">
                        {faq.q}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? 'rgba(var(--primary), 0.15)' : 'rgba(var(--muted), 0.3)' }}
                      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                      className="size-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-primary/5"
                      style={{ backgroundColor: isOpen ? undefined : undefined }}
                    >
                      <Plus
                        size={14}
                        className={`transition-colors duration-300 ${
                          isOpen ? 'text-primary' : 'text-muted-foreground/40'
                        }`}
                      />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 pl-14 md:pl-16">
                          <div className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent mb-4" />
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {faq.a}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-primary/60 font-mono">
                              {faq.category}
                            </span>
                            <span className="text-xs text-border">/</span>
                            <span className="text-xs text-muted-foreground/50">
                              Question {globalIndex + 1}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">
              No questions in this category yet.{' '}
              <button
                onClick={() => setActiveCategory('All')}
                className="text-primary hover:underline"
              >
                View all questions
              </button>
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors duration-300">
            <MessageCircle size={14} className="text-primary shrink-0" />
            <span className="text-sm text-muted-foreground">
              Still have questions?{' '}
              <Link
                href="mailto:support@kaffeine.com"
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                Get in touch{' '}
                <ArrowRight size={12} className="inline transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
