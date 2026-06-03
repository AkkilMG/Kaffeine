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
    title: 'Information We Collect',
    content: 'When you create an account, we collect your email address and a securely hashed password. If you choose to provide it, you may also add a display name. When you add monitored services, we store the URLs and database connection URIs you provide — these are encrypted with AES-256 before being written to our database. We collect anonymous usage metrics to improve the Service.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your email is used for account management and to send you real-time alerts when your monitored services go down. Encrypted connection URIs are used exclusively to perform health checks against your services. We do not use your personal data for advertising, profiling, or any purpose not explicitly described in this policy.',
  },
  {
    title: 'Data Encryption',
    content: 'All sensitive data, including database connection strings and API tokens, are encrypted using the AES-256-GCM standard before storage. Data in transit is protected by TLS 1.3. Our encryption implementation ensures that even in the unlikely event of a database breach, your credentials remain unreadable without the encryption keys.',
  },
  {
    title: 'Data Retention',
    content: 'We retain your account data for as long as your account is active. Monitoring history and analytics are retained for 30 days for free accounts. If you delete your account, all associated data is permanently deleted within 30 days. Backup archives are purged within 90 days.',
  },
  {
    title: 'Third-Party Services',
    content: 'Kaffeine uses Cloudflare Workers to perform distributed health checks from global edge locations. These workers execute health check requests against your monitored services and return status data to our primary infrastructure. Cloudflare does not have access to your stored credentials or personal data. We do not use any analytics providers, advertising networks, or third-party data processors beyond our core infrastructure.',
  },
  {
    title: 'Cookies',
    content: 'We use essential cookies required for authentication and session management. We use a session cookie to keep you logged in and a CSRF token cookie for request validation. These are strictly necessary for the operation of the Service. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. For more details, see our Cookie Policy.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal data at any time through your account settings. You may export your data in machine-readable format upon request. You may withdraw consent for data processing by deleting your account. Under applicable law (including GDPR), you also have the right to data portability and to lodge a complaint with your supervisory authority.',
  },
  {
    title: 'Data Location',
    content: 'Our primary infrastructure is hosted in the European Union. Health check workers operate from Cloudflare\'s global network of 350+ cities. By using the Service, you consent to the transfer of your data to these locations for the purposes described in this policy.',
  },
  {
    title: 'Security Measures',
    content: 'We implement industry-standard security measures including: AES-256 encryption at rest, TLS 1.3 in transit, HTTP-only session cookies, CSRF protection, rate limiting on authentication endpoints, and regular security audits of our dependencies. We follow the principle of least privilege for all internal systems.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Material changes will be communicated via email or through the Service. We encourage you to review this policy periodically.',
  },
  {
    title: 'Contact',
    content: 'If you have questions about this Privacy Policy or our data practices, please open an issue on our GitHub repository. As an open-source project, our entire codebase — including our data handling — is available for public inspection.',
  },
];

export default function PrivacyPage() {
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
            Privacy <span className="text-primary">Policy</span>
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
            We believe in radical transparency. Every line of code that handles your data is open source and publicly available for review. This Privacy Policy reflects our commitment to protecting your privacy in a way that is verifiable by anyone.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
