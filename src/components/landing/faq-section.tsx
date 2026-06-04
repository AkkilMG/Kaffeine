'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/components/landing/animations';

const faqs = [
  { q: 'What is Kaffeine?', a: 'Free and open-source uptime monitoring. Kaffeine periodically checks your websites and databases from 350+ global locations, alerting you immediately if something goes wrong.' },
  { q: 'Is Kaffeine really free?', a: 'Yes — completely free. No paid tiers, no hidden costs, no feature limitations. Every monitoring capability is available to every user.' },
  { q: 'How is my data encrypted?', a: 'All sensitive data, including database connection URIs and credentials, are AES-256 encrypted before storage. Zero-knowledge architecture ensures your data stays yours.' },
  { q: 'Can I self-host Kaffeine?', a: 'Absolutely. Kaffeine is 100% open source under the MIT license. You can inspect every line of code, contribute, or deploy on your own infrastructure anytime.' },
  { q: 'What services can I monitor?', a: 'Monitor any website via HTTP/HTTPS and databases — MongoDB, PostgreSQL, MySQL, Redis, and more. Native driver checks ensure accurate health status.' },
  { q: 'Do I need a credit card?', a: 'No. Sign up with your email and start monitoring immediately. No payment information required, ever.' },
];

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
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
              <div
                id={`faq-answer-${i}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={openIndex !== i}
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed pl-12">
                  {faq.a}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
