'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const sections = [
  {
    title: 'What Are Cookies',
    content: 'Cookies are small text files stored on your device by your web browser. They are widely used to make websites work efficiently and provide essential functionality such as authentication and session management.',
  },
  {
    title: 'Cookies We Use',
    content: 'Kaffeine uses only strictly necessary cookies that are essential for the operation of the Service. We do not use any tracking cookies, advertising cookies, analytics cookies, or third-party cookies of any kind.',
  },
  {
    title: 'Session Cookie',
    content: 'We set a session cookie (`kaffeine_session`) to keep you logged in while you navigate the dashboard. This cookie is HTTP-only (inaccessible to JavaScript) and expires when you close your browser or log out. It contains a cryptographically random session identifier, not your personal data.',
  },
  {
    title: 'CSRF Token Cookie',
    content: 'We set a CSRF (Cross-Site Request Forgery) protection cookie (`kaffeine_csrf`) to prevent malicious requests. This is a security measure that ensures form submissions and API requests originate from your authenticated session. This cookie is strictly necessary for security.',
  },
  {
    title: 'Theme Preference',
    content: 'If you toggle between light and dark mode, we store your preference in localStorage (not a cookie). This is a client-side only setting and is never sent to our servers. No personal data is associated with this preference.',
  },
  {
    title: 'No Third-Party Cookies',
    content: 'Kaffeine does not embed third-party scripts, widgets, or tracking pixels. We do not use Google Analytics, Facebook Pixel, or any similar service. We believe in privacy by default — your browsing behavior on our platform is not tracked, recorded, or shared with anyone.',
  },
  {
    title: 'Managing Cookies',
    content: 'Since our cookies are strictly necessary for the Service to function, disabling them will prevent you from logging in and using the dashboard. You can configure your browser to block or delete cookies, but please note that this will break core authentication functionality. Most browsers allow you to manage cookie settings in their preferences or settings menu.',
  },
  {
    title: 'Updates',
    content: 'We may update this Cookie Policy as our practices change. We will notify users of any material changes via email or through the Service. If we ever introduce additional cookies, they will be documented here with a clear explanation of their purpose.',
  },
  {
    title: 'Contact',
    content: 'If you have any questions about our use of cookies, please open an issue on our GitHub repository or reach out through the project\'s communication channels.',
  },
];

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}>
        <motion.div variants={fadeIn} className="mb-12">
          <div className="text-sm font-medium text-primary font-mono mb-4">/policy</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Cookie <span className="text-primary">Policy</span>
          </h1>
          <p className="text-base text-muted-foreground">
            Last updated: June 1, 2026
          </p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((section) => (
            <motion.div key={section.title} variants={fadeIn}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeIn} className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Kaffeine takes a privacy-first approach to cookies. We use the absolute minimum required for security and authentication — nothing more.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
