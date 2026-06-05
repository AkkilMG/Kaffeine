'use client';

import { motion } from 'motion/react';
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
    title: '1. Who We Are',
    content: `Kaffeine is a free and open-source uptime monitoring service provided by Arkynox ("we", "us", "our"), an Indian entity. Our complete source code is publicly available on GitHub (https://github.com/akkilmg/kaffeine), which means every aspect of how we handle your data can be independently verified by anyone, anywhere in the world.

This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use Kaffeine. It covers our compliance with applicable data protection laws across all jurisdictions where our users are located, including:
• India: Digital Personal Data Protection Act, 2023 (DPDP Act); Information Technology Act, 2000 (IT Act)
• European Union / EEA: General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679)
• United States: California Consumer Privacy Act (CCPA) as amended by CPRA; and applicable state privacy laws
• Japan: Act on the Protection of Personal Information (APPI, Act No. 57 of 2003, as amended)

We believe that privacy is a fundamental right and that open-source software is the strongest foundation for data protection accountability.`,
  },
  {
    title: '2. Information We Collect',
    content: `We practice data minimization — we collect only what is strictly necessary to provide the Service. We collect less data than virtually any comparable service.

Account Information (required for registration):
• Email address (stored in plaintext for communication purposes)
• Password (hashed using bcrypt with cost factor 12 — never stored in plaintext)
• Optional display name

Monitoring Configuration (required for the Service):
• URLs, IP addresses, and connection URIs of the services you wish to monitor
• Database connection strings and credentials (encrypted with AES-256-CBC using a randomly generated 128-bit initialization vector before storage)
• API tokens and authentication credentials required to verify the health of monitored services (encrypted with AES-256-CBC)

Usage & Operational Data:
• Health check results: uptime/downtime status, response times, HTTP status codes, timestamps
• Anonymous aggregated usage patterns (cannot be used to identify you personally)
• Client-side preference storage: theme preference (light/dark) stored in localStorage on your device only — never transmitted to our servers

Communications:
• Support correspondence and associated contact information
• Account management-related communications

What We DO NOT Collect:
• Your IP address (beyond temporary server access logs that are deleted within 7 days — see Section 5)
• Your real name, physical address, phone number, or government-issued ID
• Payment information (the Service is free)
• Tracking cookies, analytics cookies, advertising cookies (see our Cookie Policy)
• Browser fingerprint, device information, or screen resolution
• Location data (geolocation, GPS coordinates)
• Social media profiles or contacts
• Browsing history, clickstream data, or page interactions beyond what is necessary for authentication and navigation
• Contents of monitored services beyond health check responses (we do not inspect, store, or process the content of your monitored targets)
• Personal data of your end users or customers`,
  },
  {
    title: '3. How We Use Your Information',
    content: `We use your information solely for the following purposes:

Essential Service Operations:
• To create, maintain, and secure your account
• To perform health checks against the services you configure at the intervals you specify
• To calculate and display uptime/downtime statistics and response time metrics
• To send you real-time alerts when your monitored services experience downtime or recovery (via Server-Sent Events and/or email)
• To generate anonymous aggregated usage statistics for service improvement

Legal and Compliance:
• To comply with applicable legal obligations, including but not limited to the Indian IT Act, 2000 and DPDP Act, 2023
• To respond to lawful requests from government authorities as required by law
• To enforce our Terms of Service and protect our rights and the rights of other users

Service Improvement:
• To debug, troubleshoot, and resolve technical issues
• To improve and optimize the Service based on aggregated usage patterns
• To monitor and enhance the security and reliability of our infrastructure

What We Do NOT Do With Your Data:
• We do not use your personal data for advertising, marketing, or promotional purposes
• We do not engage in profiling, automated decision-making, or behavioral analysis
• We do not sell, rent, trade, or barter your personal information to third parties
• We do not share your data with data brokers, analytics providers, or advertising networks
• We do not use your data for training AI/ML models
• We do not process your data for any purpose not explicitly described in this policy`,
  },
  {
    title: '4. Cookies & Tracking Technologies',
    content: `Kaffeine uses the absolute minimum of cookies — exactly one session cookie for authentication purposes.

Session Cookie - "session":
• Purpose: Authentication — keeps you logged into your account while navigating the Service
• Type: Strictly necessary (essential for the Service to function)
• Content: A cryptographically signed JWT containing your user ID, email, and assigned role
• Duration: Persistent — expires after 7 days of inactivity, or immediately upon logout
• Security attributes: HTTP-only (inaccessible to JavaScript), Secure (only sent over HTTPS in production), SameSite=Strict (only sent for same-site requests)
• Third-party access: None — this cookie is set by and accessible only to Kaffeine

We also use localStorage (client-side only, never transmitted to servers):
• Theme preference (light/dark mode): stored in your browser's localStorage

What We Do NOT Use:
• No tracking cookies, analytics cookies, or advertising cookies
• No third-party cookies, social media widgets, or embedded content that sets cookies
• No web beacons, tracking pixels, or clear GIFs
• No browser fingerprinting, canvas fingerprinting, or device identification techniques
• No session replay, heatmap, or user behavior analytics tools
• No third-party scripts, CDN-hosted scripts, or external font services that could set cookies

For complete details, please see our Cookie Policy at /policy/cookies.`,
  },
  {
    title: '5. Data Retention & Deletion',
    content: `We retain your personal data only for as long as necessary to fulfill the purposes described in this policy, or as required by applicable law.

Account Data:
• Retained for as long as your account is active
• When you delete your account, all associated personal data is permanently and irreversibly deleted within 30 days
• Account deletion is irreversible — please export any data you wish to keep before deleting

Monitoring History:
• Health check results, response times, and uptime/downtime records: retained for 30 days
• After 30 days, historical records are automatically and permanently purged
• This is a hard retention limit — no archived copies are maintained

Backup Archives:
• Encrypted system backups: retained for a maximum of 90 days before complete and irreversible deletion
• Backups are encrypted and stored separately from production systems

Communication Records:
• Support correspondence: retained for 12 months after the last communication
• After 12 months, correspondence is permanently deleted unless a longer retention period is required by applicable law

Server Access Logs:
• Temporary connection logs (which may contain IP addresses): retained for no more than 7 days
• After 7 days, logs are permanently and irreversibly deleted
• Logs are used exclusively for security monitoring and troubleshooting

Aggregated Data:
• Anonymized, aggregated statistical data may be retained indefinitely for service improvement purposes
• This data cannot be used to identify you personally`,
  },
  {
    title: '6. Data Security',
    content: `We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, and destruction. Our security architecture is designed to be independently verifiable through our open-source codebase.

Encryption at Rest:
• All sensitive data (database connection URIs, API tokens, passwords) is encrypted before storage
• Algorithm: AES-256-CBC with PKCS7 padding
• Each encrypted value uses a cryptographically random 128-bit initialization vector
• The encryption key is stored separately from the database — in environment variables, never logged, never exposed
• The encryption mechanism is visible in our public source code at /src/lib/encryption.ts

Encryption in Transit:
• All communications between your browser and our servers are protected by TLS 1.3
• Communications between our servers and Cloudflare Workers are encrypted using mutually authenticated TLS
• HSTS (HTTP Strict Transport Security) is enforced via security headers as configured in next.config.ts
• We support only strong cipher suites — weak or deprecated ciphers are disabled

Password Security:
• Passwords are hashed using bcrypt with a cost factor of 12 (approximately 250ms per hash on modern hardware)
• bcrypt is a deliberately slow, computationally expensive algorithm designed to resist brute-force and rainbow table attacks
• The password hashing implementation is visible in our public source code
• We never store, log, or transmit passwords in plaintext at any point

Access Controls:
• We follow the principle of least privilege for all internal systems
• No human has direct access to production databases containing personal data
• Administrative access requires multi-factor authentication where supported

Session Security:
• Session tokens are JSON Web Tokens (JWT) signed with a server-side secret key
• Tokens are transmitted exclusively via HTTP-only, Secure, SameSite=Strict cookies
• This prevents XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks

Infrastructure Security:
• Rate limiting on authentication endpoints to prevent brute-force attacks
• Security headers configured in next.config.ts (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
• Regular dependency auditing using automated tooling
• Immediate patching of known vulnerabilities`,
  },
  {
    title: '7. Data Sharing & Third-Party Processors',
    content: `We do not share your personal data with third parties except in the following limited and transparent circumstances:

Cloudflare (Data Processor):
• We use Cloudflare's global edge network to execute distributed health checks from 350+ cities worldwide
• Cloudflare processes: status data (up/down results, HTTP status codes, response times, timestamps) exclusively
• Cloudflare does NOT have access to: your email address, password, stored credentials, connection URIs, or personal data
• Cloudflare acts as a data processor under our instruction — contractually bound to process data only for the purposes we specify
• Cloudflare is certified under the EU-US Data Privacy Framework and the UK Extension to the Data Privacy Framework
• Cloudflare's data processing terms: https://www.cloudflare.com/cloudflare-customer-dpa/

MongoDB Atlas (Data Processor):
• We use MongoDB Atlas for database hosting
• Your data is stored in MongoDB Atlas infrastructure located within the European Union
• MongoDB acts as a data processor under our instruction
• MongoDB's security certifications include SOC 2 Type II, ISO 27001, FedRAMP, and PCI DSS

Legal Compliance:
• We may disclose your information if required to do so by law, such as in response to a valid court order, government request, or as otherwise required by applicable law, including the Indian IT Act, 2000
• We will notify you of such requests where permitted by law
• We will challenge overbroad, unlawful, or procedurally invalid requests
• We will resist requests that would violate the GDPR, DPDP Act, or other applicable privacy laws

What We Do NOT Share:
• We do not share data with analytics providers, advertising networks, social media platforms, or any other third parties
• We do not engage in joint marketing or cross-promotional activities
• We do not share data with law enforcement proactively — only in response to valid legal process
• We do not voluntarily provide bulk user data or API access to government agencies`,
  },
  {
    title: '8. International Data Transfers',
    content: `Our primary database infrastructure is hosted within the European Union. Health check workers execute from Cloudflare's global network spanning 350+ cities worldwide. Our operations are managed from India, where Arkynox is registered.

Transfer Safeguards by Region:

From the European Union / EEA:
If you are located in the EU/EEA, your data may be transferred to India for processing. Such transfers are safeguarded by:
• Standard Contractual Clauses (SCCs) approved by the European Commission (Commission Implementing Decision (EU) 2021/914), in the absence of an adequacy decision for India
• The SCCs are available for review upon request at privacy@arkynox.com
• Where SCCs are insufficient, supplementary measures may be applied as required by the Court of Justice of the European Union's "Schrems II" decision (Case C-311/18)

From the United Kingdom:
• Data transfers from the UK are safeguarded by the UK International Data Transfer Agreement (IDTA) or UK SCCs as applicable

From Japan:
• India and the EU are recognized by Japan's Personal Information Protection Commission as having adequate data protection regimes under Article 28 of the APPI
• Data transfers from Japan are conducted in compliance with APPI requirements

From India:
• Data transfers from India are conducted in compliance with the DPDP Act, 2023 and any rules or regulations issued thereunder
• We maintain appropriate technical and organizational measures to ensure the same level of data protection applies regardless of where data is processed

By using the Service, you acknowledge that your data may be transferred to and processed in India, the European Union, and other locations where our infrastructure operates, for the purposes described in this policy.`,
  },
  {
    title: '9. Your Rights — India (DPDP Act 2023)',
    content: `If you are a user in India, the Digital Personal Data Protection Act, 2023 grants you the following rights:

Right to Information (Section 11):
You have the right to know whether we hold your personal data, a summary of the data held, and how it has been processed, used, shared, and stored. Submit your request to privacy@arkynox.com.

Right to Correction (Section 12):
You have the right to request correction of inaccurate or misleading personal data, and to update incomplete data. You can also update your data through your account dashboard.

Right to Erasure (Section 12):
You have the right to request deletion of your personal data, subject to legal retention obligations. You can delete your account at any time through your dashboard settings.

Right of Nomination (Section 14):
You have the right to nominate a person to manage your personal data in the event of your death or incapacity. This nomination must be made in writing. Contact us at privacy@arkynox.com for the nomination form.

Right to Grievance Redressal (Section 13):
You have the right to lodge a grievance regarding the handling of your personal data. Our Grievance Officer will acknowledge your grievance within 24 hours and resolve it within 15 calendar days.

Additional Protections under the IT Act, 2000:
• Reasonable security practices and procedures as required by the IT (Reasonable Security Practices) Rules, 2011
• Compensation for failure to protect personal data under Section 43A of the IT Act
• Intermediary protections under Section 79 of the IT Act`,
  },
  {
    title: '10. Your Rights — EU/EEA (GDPR)',
    content: `If you are a user in the European Union or European Economic Area, the General Data Protection Regulation (GDPR) grants you the following rights:

Right of Access (Article 15 GDPR):
You have the right to obtain confirmation of whether we process your personal data, and if so, to access that data and information about how it is processed, including the purposes of processing, categories of data processed, recipients of data, retention periods, and your other rights.

Right to Rectification (Article 16 GDPR):
You have the right to request correction of inaccurate personal data concerning you and to have incomplete data completed.

Right to Erasure / "Right to be Forgotten" (Article 17 GDPR):
You have the right to request deletion of your personal data without undue delay where one of the statutory grounds applies, including where the data is no longer necessary for the purposes for which it was collected, where you withdraw consent (if consent was the basis), or where you object to processing.

Right to Restriction of Processing (Article 18 GDPR):
You have the right to request restriction of processing of your personal data in certain circumstances, including where you contest the accuracy of the data, where processing is unlawful but you oppose erasure, or where you have objected to processing pending verification of our legitimate grounds.

Right to Data Portability (Article 20 GDPR):
You have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit that data to another controller without hindrance, where processing is based on consent or contract and is carried out by automated means.

Right to Object (Article 21 GDPR):
You have the right to object to processing of your personal data based on legitimate interests or for direct marketing purposes. We do not engage in direct marketing, and any objection to processing based on legitimate interests will be evaluated and honored unless we demonstrate compelling legitimate grounds that override your interests.

Rights Related to Automated Decision-Making (Article 22 GDPR):
You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you. We do not engage in automated decision-making or profiling.

Right to Lodge a Complaint (Article 77 GDPR):
You have the right to lodge a complaint with your local data protection supervisory authority. Relevant authorities include the CNIL (France), ICO (UK), DPC (Ireland), BfDI (Germany), and Autoriteit Persoonsgegevens (Netherlands).

To exercise any of these rights, contact our Data Protection Officer at dpo@arkynox.com. We will respond to all legitimate requests within 30 days (Article 12(3) GDPR). We may extend this period by a further 60 days for complex or high-volume requests, with notice to you.`,
  },
  {
    title: '11. Your Rights — United States (CCPA & State Laws)',
    content: `California Residents (CCPA/CPRA):
If you are a resident of California, the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA) grants you the following rights:

Right to Know (Cal. Civ. Code § 1798.110):
You have the right to request disclosure of the categories and specific pieces of personal information we have collected about you, the categories of sources from which it was collected, the business purpose for collecting it, and the categories of third parties with whom it was shared.

Right to Delete (Cal. Civ. Code § 1798.105):
You have the right to request deletion of personal information we have collected from you, subject to certain exceptions (such as legal retention obligations or completing transactions).

Right to Correct (Cal. Civ. Code § 1798.106):
You have the right to request correction of inaccurate personal information.

Right to Limit Use of Sensitive Personal Information (Cal. Civ. Code § 1798.121):
We use sensitive personal information (such as account credentials) only for the purpose of providing the Service — which is a permitted purpose under the CCPA. We do not use sensitive personal information for any other purpose.

Right to Non-Discrimination (Cal. Civ. Code § 1798.125):
We will not discriminate against you for exercising any of your CCPA rights. This means we will not deny services, charge different prices, or provide a different level of service because you exercised your rights.

Right to Opt-Out of Sale/Sharing:
We do not sell or share personal information as defined under the CCPA. Therefore, no opt-out is necessary. We will not sell or share your personal information in the future without providing you with notice and an opportunity to opt out.

Other US States:
For residents of other US states with comprehensive privacy laws, the following additional rights apply:
• Virginia (CDPA): Right to opt out of processing for targeted advertising, sale, and profiling
• Colorado (CPA): Right to access, correct, delete, and port data; right to opt out of targeted advertising and profiling
• Connecticut (CTDPA): Right to access, correct, delete, port, and opt out of targeted advertising and sale
• Utah (UCPA): Right to access, delete, and opt out of sale and targeted advertising
• Texas (TDPSA), Oregon (OCPA), Iowa (ICDPA), Tennessee (TIPA), Montana (MCDPA), Delaware (DPDPA): Comparable rights under each state's respective privacy law

To exercise your rights under US privacy laws, contact us at privacy@arkynox.com. We will verify your identity before processing your request, consistent with CCPA requirements.`,
  },
  {
    title: '12. Your Rights — Japan (APPI)',
    content: `If you are a user in Japan, the Act on the Protection of Personal Information (APPI) grants you the following rights:

Right to Disclosure (Article 28 APPI):
You have the right to request disclosure of retained personal data, including the purpose of use, categories of data, and the identity of the data handler. Submit your request to privacy@arkynox.com.

Right to Correction (Article 29 APPI):
You have the right to request correction, addition, or deletion of retained personal data that is inaccurate or outdated. We will respond within 30 days.

Right to Suspension of Use (Article 30 APPI):
You have the right to request suspension of use, deletion, or cessation of provision to third parties of your personal data where:
• The data was obtained or used in violation of the APPI
• The data is no longer needed for the stated purpose of use
• There has been a breach of the proper handling of personal data

Right to Explanation (Article 31 APPI):
You have the right to receive an explanation of procedures for requesting disclosure and other mechanisms set forth under the APPI. This policy serves as that explanation.

Right to Complaint (Article 35 APPI):
You have the right to file a complaint with the Personal Information Protection Commission (PPC — 個人情報保護委員会), which is the supervisory authority under the APPI. Complaints can be filed at the PPC's office: https://www.ppc.go.jp/en/

Our obligations under APPI:
• We will handle personal information appropriately and securely
• We will specify the purpose of use and limit processing to that purpose
• We will not provide personal data to third parties without your consent, except as permitted under the APPI
• We will respond to disclosure, correction, and suspension requests within 30 days
• We will maintain records of third-party disclosures where required
• We will take necessary and appropriate measures for the secure management of personal data`,
  },
  {
    title: '13. Lawful Basis for Processing (GDPR)',
    content: `For users in the European Union and European Economic Area, we process your personal data under the following lawful bases as defined in Article 6 of the GDPR:

Contractual Necessity (Article 6(1)(b) GDPR):
Processing your account data, email address, and monitoring configurations is necessary to perform our contract with you — to provide the Service you signed up for. Without this data, we cannot create your account, authenticate you, or perform health checks on your behalf.

Legitimate Interests (Article 6(1)(f) GDPR):
Processing anonymous operational metrics, security monitoring, and system optimization is necessary for our legitimate interests in:
• Improving and maintaining the security of the Service
• Analyzing usage patterns to enhance the user experience
• Debugging and troubleshooting technical issues

...provided these interests are not overridden by your fundamental rights and interests. We have conducted a Legitimate Interest Assessment (LIA) to confirm that our legitimate interests are proportionate and justified.

Legal Obligation (Article 6(1)(c) GDPR):
Processing may be necessary to comply with our legal obligations, such as responding to lawful requests from government authorities or maintaining records as required by applicable law.

Consent (Article 6(1)(a) GDPR):
We do not rely on consent as a basis for processing your personal data under the GDPR. You are not required to provide consent as a condition of using the Service. If we ever need to process data based on consent, we will obtain your freely given, specific, informed, and unambiguous consent before processing begins, and you will have the right to withdraw your consent at any time.`,
  },
  {
    title: '14. Grievance Officer (India)',
    content: `In compliance with the Information Technology Act, 2000, the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the Digital Personal Data Protection Act, 2023, our Grievance Officer for data protection and privacy matters is:

Name: Arkynox Grievance Officer
Email: hello@arkynox.com
Physical Address: Available upon request for verified legal requests
Response Timeframe: All grievances are acknowledged within 24 hours and resolved within 15 calendar days from the date of receipt

Scope of the Grievance Officer:
• Addressing complaints related to data handling and privacy breaches
• Responding to user requests regarding their data rights under the DPDP Act 2023
• Handling complaints related to content on the Service that violates applicable law
• Responding to orders or requests from government authorities under applicable law
• Any other matter required under the IT Act, IT Rules 2021, or DPDP Act 2023

Grievance Submission Process:
1. Submit your grievance via email to hello@arkynox.com with the subject line "Privacy Grievance: [brief description]"
2. Include: your full name, the email address used for your Kaffeine account, a detailed description of the grievance, any supporting documents or evidence, and your preferred resolution
3. You will receive an acknowledgment within 24 hours
4. We will investigate and communicate the resolution within 15 calendar days
5. If the grievance is not resolved to your satisfaction, you may escalate to the appropriate appellate authority under the DPDP Act 2023 or the relevant government authority under the IT Act, 2000`,
  },
  {
    title: '15. Data Protection Officer (GDPR)',
    content: `For users in the European Union and European Economic Area, our Data Protection Officer (DPO) can be contacted at:

Email: dpo@arkynox.com

The DPO is appointed in accordance with Article 37 of the GDPR and is responsible for:
• Monitoring compliance with the GDPR, the ePrivacy Directive, and other applicable data protection laws
• Informing and advising us and our employees of our data protection obligations under Article 39(1)(a) GDPR
• Providing advice regarding Data Protection Impact Assessments (DPIAs) under Article 35 GDPR and monitoring their performance under Article 39(1)(c) GDPR
• Acting as a contact point for data subjects regarding all matters related to processing of their personal data under Article 39(1)(e) GDPR
• Cooperating with data protection supervisory authorities under Article 39(1)(d) GDPR

The DPO can be contacted for:
• Requests to exercise your GDPR rights (access, rectification, erasure, restriction, portability, objection)
• Questions about how your personal data is processed
• Complaints about our data handling practices
• Requests for information about international data transfer safeguards

Right to Lodge a Complaint:
If you believe we have processed your personal data in violation of the GDPR, you have the right to lodge a complaint with your local data protection supervisory authority. A list of EU data protection authorities is available at: https://edpb.europa.eu/about-edpb/about-edpb/members_en`,
  },
  {
    title: "16. Children's Privacy",
    content: `Kaffeine is not intended for children under the age of 13 (or the applicable age of digital consent in your jurisdiction, as detailed below).

Age of Digital Consent by Jurisdiction:
• India: 18 years (under DPDP Act 2023, a child is defined as any person below 18)
• European Union: 16 years (with member states permitted to set lower ages between 13-16)
• United States: 13 years (under COPPA — Children's Online Privacy Protection Act)
• Japan: 20 years (under the Civil Code of Japan, with parental consent required for minors)

Our Policy:
• We do not knowingly collect, store, or process personal information from children below the applicable age of digital consent
• We verify age during registration and reject registrations from users who do not meet the minimum age requirement
• If you are a parent or guardian and believe your child has provided us with personal data without your consent, please contact us immediately at privacy@arkynox.com
• We will take immediate steps to delete such data and disable the associated account
• We will conduct a thorough investigation and take corrective action to prevent recurrence

We do not rely on parental consent mechanisms for data processing. If a user is below the age of digital consent in their jurisdiction, they may not use the Service.`,
  },
  {
    title: '17. Data Breach Notification',
    content: `In the event of a data breach that affects your personal data, we will:

Our Obligations:
• Notify you without undue delay after becoming aware of the breach (in accordance with applicable legal requirements)
• Provide a description of the nature of the breach, including the categories and approximate number of data subjects and records concerned
• Describe the likely consequences of the breach
• Describe the measures we have taken or propose to take to address the breach and mitigate its effects
• Provide the name and contact details of our Data Protection Officer or Grievance Officer from whom more information can be obtained

Jurisdiction-Specific Notification:
• GDPR (EU/EEA): Notification within 72 hours to the relevant supervisory authority under Article 33, and to affected data subjects without undue delay under Article 34 — unless the breach is unlikely to result in a risk to the rights and freedoms of natural persons
• DPDP Act (India): Notification to the Data Protection Board of India and affected data subjects in accordance with the DPDP Act and applicable rules
• CCPA (California): Notification as required under Cal. Civ. Code § 1798.29 and § 1798.82 for security breaches involving personal information

Breach Prevention Measures:
• All data is encrypted at rest and in transit
• Access controls follow the principle of least privilege
• Regular security audits and penetration testing
• Dependency vulnerability scanning
• Immediate notification to our infrastructure providers (Cloudflare, MongoDB) in case of security incidents`,
  },
  {
    title: '18. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in:
• The Service, its features, or its functionality
• Applicable data protection laws, regulations, or regulatory guidance
• Our data processing practices or the processors we engage
• User feedback or industry best practices

Process for Changes:
1. Changes will be posted on this page with an updated "Last updated" date
2. Material changes will be communicated via email to registered users at least 30 days before they take effect
3. A summary of changes will be included in the email notification
4. If you do not agree with the changes, you should delete your account before the changes take effect
5. Your continued use of the Service after the effective date constitutes acceptance of the updated policy

Minor changes (such as corrections, clarifications, or formatting improvements) may be made without prior notice and will be effective immediately upon posting.`,
  },
  {
    title: '19. Contact Information',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out through the appropriate channel:

Privacy-Specific Inquiries: privacy@arkynox.com
General Inquiries: https://arkynox.com
Public Issue Tracker: https://github.com/akkilmg/kaffeine/issues
Security Vulnerabilities: https://github.com/akkilmg/kaffeine/blob/main/SECURITY.md

Designated Contacts by Jurisdiction:
• India (Grievance Officer — IT Act & DPDP Act): hello@arkynox.com
• European Union (Data Protection Officer — GDPR): dpo@arkynox.com
• United States (Privacy Requests — CCPA/State Laws): privacy@arkynox.com
• Japan (Privacy Requests — APPI): privacy@arkynox.com

We strive to respond to all inquiries within 48 hours. For grievance submissions, we acknowledge within 24 hours and resolve within 15 calendar days.

As an open-source project, our entire codebase — including every aspect of how we handle data — is publicly available for inspection at https://github.com/akkilmg/kaffeine. We believe this is the highest form of accountability and invite you to verify our claims independently.`,
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
            Last updated: June 6, 2026
          </p>
          <p className="text-sm text-muted-foreground/60 mt-2">
            Covers India (DPDP Act 2023, IT Act 2000), EU (GDPR), US (CCPA/CPRA, state laws), Japan (APPI).
          </p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((section) => (
            <motion.div key={section.title} variants={fadeIn}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0 whitespace-pre-line">{paragraph}</p>
              ))}
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeIn} className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            We believe in radical transparency. Every line of code that handles your data is open source and publicly available for review. This Privacy Policy reflects our commitment to protecting your privacy in a way that is verifiable by anyone, anywhere in the world. Our complete source code is available on{' '}
            <Link href="https://github.com/akkilmg/kaffeine" target="_blank" className="text-primary hover:underline">GitHub</Link>.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
