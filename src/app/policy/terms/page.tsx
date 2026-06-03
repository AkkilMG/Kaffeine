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
    title: 'Acceptance of Terms',
    content: 'By accessing or using Kaffeine ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not access or use the Service. Kaffeine is provided by anomalyco ("we", "us", "our").',
  },
  {
    title: 'Service Description',
    content: 'Kaffeine is a free and open-source uptime monitoring service that periodically checks the availability of websites and databases. The Service provides real-time alerts, analytics dashboards, and historical uptime data. All source code is released under the MIT License and is available for inspection, modification, and self-hosting.',
  },
  {
    title: 'Eligibility',
    content: 'You must be at least 13 years of age to use the Service. By agreeing to these terms, you represent and warrant that you have the full power and authority to enter into this agreement. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization.',
  },
  {
    title: 'User Responsibilities',
    content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. You may not use the Service to monitor any website or database that you do not own or have explicit permission to monitor.',
  },
  {
    title: 'Acceptable Use',
    content: 'You agree not to use the Service for any unlawful purpose or in violation of any applicable laws or regulations. You may not attempt to disrupt, degrade, or impair the Service or its underlying infrastructure. Automated scraping, excessive API requests, or any activity that imposes an unreasonable load on our systems is prohibited.',
  },
  {
    title: 'Data & Privacy',
    content: 'Your use of the Service is also governed by our Privacy Policy and Cookie Policy. We take data protection seriously. All sensitive data, including database connection URIs, are encrypted using AES-256 before storage. We do not sell your personal data or share it with third parties for their marketing purposes.',
  },
  {
    title: 'Open Source License',
    content: 'The Kaffeine source code is licensed under the MIT License. You are free to use, modify, distribute, and self-host the software in accordance with the terms of that license. However, the hosted Service provided by us is governed by these Terms of Service. Self-hosted instances are independent and not covered by this agreement.',
  },
  {
    title: 'Service Availability',
    content: 'We strive to maintain high availability of the Service but make no guarantees of uninterrupted or error-free operation. The Service is provided "as is" and "as available". We reserve the right to temporarily suspend access for maintenance, updates, or capacity improvements with reasonable notice where practicable.',
  },
  {
    title: 'Limitation of Liability',
    content: 'To the maximum extent permitted by applicable law, Kaffeine and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service. The Service is monitoring infrastructure — always verify critical outages through secondary means.',
  },
  {
    title: 'Termination',
    content: 'We reserve the right to suspend or terminate your access to the Service at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other users, third parties, or the Service itself. Upon termination, your data will be deleted within 30 days unless required otherwise by law.',
  },
  {
    title: 'Changes to Terms',
    content: 'We may revise these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the Service after any changes constitutes acceptance of the new terms. We will make reasonable efforts to notify users of material changes via email or through the Service.',
  },
  {
    title: 'Governing Law',
    content: 'These terms shall be governed by and construed in accordance with the laws of Sweden, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of Sweden.',
  },
  {
    title: 'Contact',
    content: 'If you have any questions about these Terms of Service, please open an issue on our GitHub repository or contact us through the project\'s communication channels.',
  },
];

export default function TermsPage() {
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
            Terms of <span className="text-primary">Service</span>
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
            These Terms of Service are adapted for Kaffeine, an open-source project. They are provided for informational purposes and do not constitute legal advice. If you have specific legal concerns, please consult a qualified attorney.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
