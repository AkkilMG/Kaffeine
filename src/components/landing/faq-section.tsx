'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/components/landing/animations';

const faqs = [
  { q: 'What is Kaffeine?', a: 'Free and open-source uptime monitoring. It periodically checks your websites and databases, alerting you immediately if something goes wrong.' },
  { q: 'Is Kaffeine really free?', a: 'Yes — completely free. No paid tiers, no hidden costs, no feature limitations.' },
  { q: 'How is my data encrypted?', a: 'All sensitive data, including database URIs, are AES-256 encrypted before storage.' },
  { q: 'Can I self-host Kaffeine?', a: 'Absolutely. 100% open source under the MIT license. Deploy on your own infrastructure.' },
  { q: 'What services can I monitor?', a: 'Websites via HTTP/HTTPS and databases — MongoDB, PostgreSQL, MySQL, and more.' },
  { q: 'Do I need a credit card?', a: 'No. Sign up with your email and start monitoring. No payment info required.' },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="text-sm font-medium text-primary font-mono mb-4">
            /faq
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Frequently asked <span className="text-primary">questions</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-2"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                openIndex === i
                  ? 'border-primary/30 bg-card shadow-md'
                  : 'border-border bg-card hover:border-primary/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    size={14}
                    className={`shrink-0 transition-colors duration-300 ${
                      openIndex === i ? 'text-primary' : 'text-muted-foreground/40'
                    }`}
                  />
                  <span className="font-medium text-sm md:text-base text-foreground">{faq.q}</span>
                </div>
                <ChevronRight
                  size={14}
                  className={`shrink-0 text-muted-foreground transition-all duration-300 ${
                    openIndex === i ? 'rotate-90 text-primary' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed pl-12">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
