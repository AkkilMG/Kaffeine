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
    title: '1. Acceptance of Terms',
    content: `By accessing or using Kaffeine ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all the terms, you may not access or use the Service. Kaffeine is provided by Arkynox ("we", "us", "our"), an Indian entity registered in India. These Terms constitute a legally binding agreement between you and Arkynox. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms. If you do not have such authority, you must not use the Service on behalf of that organization.`,
  },
  {
    title: '2. Service Description',
    content: `Kaffeine is a free and open-source uptime monitoring service that periodically checks the availability of websites, databases, and other network services. The Service provides real-time alerts via Server-Sent Events (SSE), 24-hour analytics dashboards, historical uptime data, and role-based dashboards for users and administrators.

All source code for Kaffeine is released under the Apache License 2.0 and is available for public inspection, modification, auditing, and self-hosting on GitHub. The hosted version of Kaffeine ("Hosted Service") is provided as a service by Arkynox. Self-hosted instances are independent deployments not governed by these Terms — each self-hosted operator is solely responsible for their own terms of service, data handling, and legal compliance.

Kaffeine is provided free of charge with no paid tiers, no advertising, and no commercial data exploitation.`,
  },
  {
    title: '3. Open Source Transparency & Verifiability',
    content: `Kaffeine is 100% open source. Our entire codebase is publicly available under the Apache License 2.0 at https://github.com/akkilmg/kaffeine. This means you are free to inspect, modify, distribute, audit, and self-host the software without restrictions.

We believe that open source is the foundation of trust. Every claim we make about:
• Encryption (AES-256-CBC with random IVs)
• Password storage (bcrypt, cost factor 12)
• Data minimization practices
• Cookie usage (single HTTP-only session cookie)
• Third-party data processing (Cloudflare Workers only)
• Session management (JWT with HTTP-only, Secure, SameSite=Strict cookies)

...can be independently verified by reviewing our source code. We encourage security researchers, privacy advocates, and users to audit our codebase and hold us accountable. Our security vulnerability disclosure process is documented in SECURITY.md.

Contributions to the project are welcomed. By contributing, you agree that your contributions are made under the Apache License 2.0, ensuring that the project remains free and open forever.`,
  },
  {
    title: '4. Eligibility & Registration',
    content: `You must be at least 13 years of age to use the Service. If you are between 13 and 18 years of age, you confirm that you have obtained parental or guardian consent to use the Service under these Terms.

Jurisdiction-Specific Age Requirements:
• India: Minimum age of 18 for independent use; users between 13-18 require parental consent as per the Digital Personal Data Protection Act, 2023.
• European Union / EEA: Minimum age of 16, or such lower age as the applicable member state law permits (ranging from 13 to 16). Users below this age require verifiable parental consent under Article 8 GDPR.
• United Kingdom: Minimum age of 13 under the Data Protection Act 2018. Users under 18 are advised to obtain parental or guardian consent. The Age-Appropriate Design Code (Children's Code) applies to services likely to be accessed by children.
• United States: Minimum age of 13 under COPPA (Children's Online Privacy Protection Act). Users between 13-18 require parental consent.
• Australia: Minimum age of 15 under the Privacy Act 1988 (Cth) and the Children's Online Privacy Code. Users under 18 are encouraged to obtain parental or guardian consent.
• Japan: Minimum age of 18 under the Civil Code of Japan (as amended effective April 1, 2022). Users between 13-17 require parental consent.
• Brazil: Minimum age of 18 for independent consent under the LGPD and the Estatuto da Criança e do Adolescente (Law No. 8,069/1990). Users between 13-17 require parental consent.
• UAE: Minimum age of 21 under the UAE Civil Transactions Law and Federal Decree-Law No. 45 of 2021 (PDPL). Users below 21 require consent from a legal guardian.
• Saudi Arabia: Minimum age of 18 under the Saudi PDPL (Royal Decree M/19 of 2022) and the Civil Transactions Law. Users below 18 require consent from a legal guardian.

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration. Any account found to have provided false information may be suspended or terminated.

You may register only one account. Multiple accounts created by the same individual without authorization may be subject to termination.`,
  },
  {
    title: '5. Account Security',
    content: `You are responsible for:
• Maintaining the confidentiality of your password and session credentials
• All activities that occur under your account, whether authorized by you or not
• Immediately notifying us of any unauthorized use of your account or any security breach
• Ensuring that you log out of your account at the end of each session, especially on shared or public devices

We use bcrypt password hashing (cost factor 12) for password storage, JWT-based session tokens transmitted via HTTP-only, Secure, SameSite=Strict cookies, and rate limiting on authentication endpoints. However, no security measure is perfect. We recommend using a strong, unique password for your Kaffeine account and enabling any additional security features we may offer.

We are not liable for any loss or damage arising from your failure to comply with these security obligations.`,
  },
  {
    title: '6. Acceptable Use',
    content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not use the Service:

Prohibited Monitoring Targets:
• Any website, server, database, or network service that you do not own or have explicit written permission to monitor
• Any system where monitoring would violate applicable laws, including data protection and privacy laws
• Any system that you are prohibited from monitoring under a contract or agreement

Prohibited Conduct:
• Using the Service to violate any applicable law, including the Indian IT Act 2000 (Sections 43, 66), the US Computer Fraud and Abuse Act (CFAA, 18 U.S.C. § 1030), the EU Cybercrime Directive (Directive 2013/40/EU), the UK Computer Misuse Act 1990, Australia's Criminal Code Act 1995 (Cth) — Part 10.7 (Computer Offences), Japan's Unauthorized Computer Access Law (Act No. 128 of 1999), Brazil's Cybercrime Law (Law No. 12,737/2012 — "Carolina Dieckmann Law"), the UAE Cybercrime Law (Federal Decree-Law No. 34 of 2021), or Saudi Arabia's Anti-Cyber Crime Law (Royal Decree M/17 of 2007)
• Attempting to disrupt, degrade, impair, or gain unauthorized access to the Service, its infrastructure, or other users' accounts
• Automated scraping, data mining, or extraction of data from the Service beyond what is reasonably necessary for personal use
• Sending unsolicited or unauthorized communications through the Service
• Using the Service to distribute malware, ransomware, phishing content, or any harmful code
• Impersonating any person or entity, or falsely stating or misrepresenting your affiliation with any person or entity
• Engaging in any activity that imposes an unreasonable or disproportionate load on our infrastructure (as determined in our reasonable discretion)
• Using the Service for any benchmarking or competitive analysis without our prior written consent
• Circumventing or attempting to circumvent any rate limits, access controls, or technical measures we implement

Monitoring of the Service: We may monitor, review, and analyze your use of the Service for security, compliance, and operational purposes. We do not monitor the content of your monitored targets — we only track whether they respond to health checks.`,
  },
  {
    title: '7. Monitoring Services & Limitations',
    content: `When you configure a service to monitor, you are responsible for ensuring that:
• You have all necessary rights and permissions to monitor the target
• The monitoring frequency and configuration comply with the target's terms of service and acceptable use policies
• Your monitoring activities comply with all applicable laws

Service Limitations:
• Free Tier Limits: Usage may be subject to reasonable limits on the number of monitored services, check frequency, and API requests. Current limits are displayed in your dashboard.
• Check Frequency: Health checks are performed at regular intervals based on your service configuration. The minimum interval is determined by our infrastructure and may be adjusted.
• Real-Time Alerts: While we strive to deliver alerts promptly, we do not guarantee instant notification. Alert delivery depends on network conditions, browser connections (SSE), and other factors beyond our control.
• Data Retention: Health check results are retained for 30 days. Historical data beyond this period is automatically purged. You should export any data you wish to keep.

Kaffeine is a monitoring tool and should not be your sole source of truth for critical infrastructure status. We strongly recommend verifying critical outages through secondary means.`,
  },
  {
    title: '8. Account Suspension & Termination',
    content: `We reserve the right to suspend or terminate your access to the Service at any time, without prior notice, for conduct that we believe, in our sole discretion:
• Violates these Terms or applicable law
• Is harmful to other users, third parties, or the Service itself
• Could create legal liability for us or others
• Could compromise the security or integrity of the Service

Grounds for termination include, but are not limited to:
• Unauthorized monitoring of third-party systems
• Abuse of the Service infrastructure
• Violation of applicable laws
• Providing false or fraudulent information during registration
• Attempting to circumvent technical measures or access controls
• Repeated violations of acceptable use policies

Termination Procedure:
• Upon termination, your account and associated data will be scheduled for deletion within 30 days, unless retention is required by applicable law
• You will receive a notification of termination via email where practicable
• You may delete your account at any time through your dashboard settings — all associated data will be permanently deleted within 30 days of deletion
• We may retain anonymized, aggregated data that cannot be used to identify you personally

Appeals: If you believe your account was terminated in error, please contact our Grievance Officer at hello@arkynox.com. We will review your appeal within 15 business days.`,
  },
  {
    title: '9. Data, Privacy & Encryption',
    content: `Your use of the Service is governed by our Privacy Policy and Cookie Policy, which are incorporated into these Terms by reference. We take data protection seriously.

What We Encrypt:
• All sensitive data, including database connection URIs, API tokens, and passwords, are encrypted before storage
• Encryption at rest: AES-256-CBC with a randomly generated 128-bit initialization vector per encrypted value
• Encryption in transit: TLS 1.3 for all browser-server communications and server-to-Cloudflare communications
• Password storage: bcrypt with cost factor 12

What We Do Not Do:
• We do not sell, rent, or trade your personal data to third parties
• We do not share your data for advertising, marketing, or profiling purposes
• We do not use tracking cookies, analytics cookies, or third-party cookies
• We do not collect your IP address beyond temporary server logs (retained for 7 days then permanently deleted)
• We do not engage in behavioral tracking, fingerprinting, or any form of user surveillance

Data processing is governed by:
• India: Information Technology Act, 2000; IT (Reasonable Security Practices) Rules, 2011; Digital Personal Data Protection Act, 2023
• EU: General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679)
• UK: UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018
• US: California Consumer Privacy Act (CCPA) as amended by CPRA, and applicable state privacy laws
• Australia: Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles (APPs); Notifiable Data Breaches (NDB) scheme
• Japan: Act on the Protection of Personal Information (APPI, Act No. 57 of 2003)
• Brazil: Lei Geral de Proteção de Dados Pessoais (LGPD, Law No. 13,709/2018)
• UAE: Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL)
• Saudi Arabia: Personal Data Protection Law (PDPL, Royal Decree M/19 of 2022)

For complete details on how we handle your data, please read our Privacy Policy and Cookie Policy. As an open-source project, every aspect of our data handling can be independently verified by reviewing our source code.`,
  },
  {
    title: '10. Service Availability & Disclaimer',
    content: `We strive to maintain high availability of the Service but make no guarantees of uninterrupted or error-free operation. THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

Specific Disclaimers:
• Kaffeine is a monitoring tool and should not be your sole source of truth for critical infrastructure status
• We do not guarantee that health check results are accurate, timely, or complete
• We are not responsible for false positives, false negatives, or missed alerts
• We do not guarantee that the Service will meet your specific requirements or that it will be available at all times

Service Interruptions:
• Maintenance: We may temporarily suspend access for scheduled maintenance, updates, or capacity improvements with reasonable notice where practicable
• Force Majeure: In the event of force majeure — including but not limited to acts of God, war, terrorism, cyberattacks, infrastructure or utility failures, government actions, pandemics, labor disputes, or internet service provider disruptions — service availability may be affected without liability
• Emergency: We may take immediate action without notice to address security emergencies, legal compliance, or to prevent harm to the Service or users

No Obligation to Monitor: We have no obligation to monitor the Service or user content, but we may do so to comply with legal obligations, enforce these Terms, or protect the rights and safety of users and third parties.`,
  },
  {
    title: '11. Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, Arkynox, its contributors, officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages — including but not limited to loss of profits, revenue, data, business, goodwill, business interruption, or cost of procurement of substitute services — arising out of or relating to your use of or inability to use the Service.

This limitation applies whether the alleged liability is based on contract, tort (including negligence), strict liability, product liability, or any other legal theory, even if we have been advised of the possibility of such damage.

Jurisdiction-Specific Limitations:
• India: Liability is limited as permitted under the Information Technology Act, 2000 and Indian contract law. Under Section 79 of the IT Act, we are an intermediary and are not liable for third-party content or actions.
• European Union / EEA: Nothing in these Terms excludes or limits liability for (a) death or personal injury caused by negligence, (b) fraud or fraudulent misrepresentation, (c) gross negligence or willful misconduct, or (d) any liability that cannot be excluded or limited under applicable law. Our liability shall be limited to the amount you have paid for the Service in the 12 months preceding the claim. Since the Service is free, this amount is zero.
• United Kingdom: Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any liability that cannot be excluded or limited under the UK Consumer Rights Act 2015 or other applicable law. Our liability shall be limited to the amount you have paid for the Service in the 12 months preceding the claim. Since the Service is free, this amount is zero.
• United States: Some states do not allow the exclusion or limitation of incidental or consequential damages, so the above limitations may not fully apply to you. In such cases, our liability shall be limited to the fullest extent permitted by applicable law.
• Australia: Nothing in these Terms excludes, restricts, or modifies guarantees, rights, or remedies conferred under the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010) that cannot be excluded. Liability for non-excludable guarantees is limited, at our option, to the re-supply of the Service or the cost of re-supply. We shall not be liable for any indirect or consequential loss under the Privacy Act 1988 or otherwise.
• Japan: Liability limitations are subject to the provisions of the Japanese Civil Code (Act No. 89 of 1896) and the Specified Commercial Transactions Act. We shall not be liable for damages arising from force majeure or from events beyond our reasonable control.
• Brazil: Nothing in these Terms excludes or limits liability for (a) death or personal injury, (b) fraud, (c) willful misconduct or gross negligence, (d) consumer damages under the Brazilian Consumer Protection Code (Law No. 8,078/1990), or (e) liability that cannot be excluded under the LGPD or applicable law. For free services, liability is limited as permitted under Brazilian law.
• UAE: Liability limitations are subject to the UAE Civil Transactions Law (Federal Law No. 5 of 1985, as amended) and the UAE PDPL. We shall not be liable for damages arising from force majeure, acts of government authority, or events beyond our reasonable control. Nothing in these Terms excludes liability for fraud, willful misconduct, or death or personal injury caused by negligence.
• Saudi Arabia: Liability limitations are subject to the Saudi Civil Transactions Law (Royal Decree M/191 of 2023) and the Saudi PDPL. We shall not be liable for damages arising from force majeure or events beyond our reasonable control. Liability for personal injury or wrongful death cannot be excluded.`,
  },
  {
    title: '12. Indemnification',
    content: `You agree to indemnify, defend, and hold harmless Arkynox, its contributors, officers, directors, employees, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees and legal costs) arising out of or related to:
(a) your use of the Service in violation of these Terms
(b) your violation of any applicable law, including but not limited to the Indian IT Act 2000, the US Computer Fraud and Abuse Act, the EU Cybercrime Directive, the UK Computer Misuse Act 1990, Australia's Criminal Code Act 1995 (Part 10.7), Japan's Unauthorized Computer Access Law, Brazil's Cybercrime Law, the UAE Cybercrime Law, or Saudi Arabia's Anti-Cyber Crime Law
(c) your unauthorized monitoring of third-party systems
(d) any content, data, or configuration you submit to or through the Service
(e) your violation of any third-party rights, including but not limited to intellectual property rights, privacy rights, or contractual rights

We reserve the right, at our own expense, to assume the exclusive defense and control of any matter subject to indemnification by you, in which case you will cooperate with us in asserting any available defenses. This indemnification obligation survives the termination of your account and these Terms.`,
  },
  {
    title: '13. Governing Law & Dispute Resolution',
    content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of India.

Dispute Resolution Process:
1. Good Faith Negotiations: Any disputes first shall be attempted to be resolved through good faith negotiations between the parties for a period of 30 days from the date of written notice.
2. Arbitration: If the dispute cannot be resolved through negotiations, it shall be settled by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 of India. The arbitration shall be conducted in English by a sole arbitrator appointed by mutual agreement of the parties. If the parties cannot agree on an arbitrator within 30 days, the arbitrator shall be appointed in accordance with the Arbitration and Conciliation Act, 1996. The venue of arbitration shall be New Delhi, India.
3. Costs: Each party shall bear its own costs of arbitration. The arbitrator's fees and administrative costs shall be shared equally, unless the arbitrator determines otherwise in the award.
4. Injunctive Relief: Notwithstanding the arbitration agreement, Arkynox may seek injunctive or other equitable relief in any court of competent jurisdiction to protect its intellectual property rights, confidential information, or to enforce compliance with these Terms.

Jurisdiction-Specific Provisions:
• India: The courts of New Delhi shall have exclusive jurisdiction over any matters arising under these Terms, subject to the arbitration clause above.
• European Union / EEA: Nothing in this clause deprives you of the protection of mandatory consumer protection laws of your country of residence. EU users may also bring claims before the courts of their country of residence in accordance with applicable EU regulations (such as the Brussels I Regulation (EU) No 1215/2012).
• United Kingdom: Nothing in this clause deprives you of the protection of mandatory consumer protections under the UK Consumer Rights Act 2015. You may also bring claims before the courts of England and Wales.
• United States: You may also have rights under state or federal law that cannot be contractually waived. Nothing in this clause requires you to resolve disputes in India if such requirement would be unenforceable under applicable US law.
• Australia: Nothing in this clause deprives you of protections under the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010). You may also bring claims before the courts of your state or territory in Australia.
• Japan: Disputes may also be brought before the Japanese courts in accordance with Japanese law. The Tokyo District Court shall have exclusive jurisdiction as the court of first instance for users resident in Japan, if applicable under Japanese law.
• Brazil: Nothing in this clause deprives you of the protection of mandatory consumer protections under the Brazilian Consumer Protection Code (Law No. 8,078/1990). You may also bring claims before the courts of Brazil in accordance with the Brazilian Code of Civil Procedure.
• UAE: Disputes may also be brought before the competent courts of the UAE in accordance with UAE law. Users in the Dubai International Financial Centre (DIFC) or Abu Dhabi Global Market (ADGM) may also have recourse to the respective free zone courts.
• Saudi Arabia: Disputes may also be brought before the competent courts of Saudi Arabia in accordance with Saudi law, subject to the Law of Procedure before Sharia Courts.

Class Action Waiver: To the fullest extent permitted by applicable law, all claims must be brought in an individual capacity and not as a plaintiff or class member in any purported class, collective, or representative proceeding. This waiver does not apply to users in jurisdictions where class action waivers are unenforceable.`,
  },
  {
    title: '14. Grievance Officer (India)',
    content: `In compliance with:
• The Information Technology Act, 2000 (IT Act) and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
• The Digital Personal Data Protection Act, 2023 (DPDP Act)

...the Grievance Officer for Kaffeine is:

Name: Arkynox Grievance Officer
Email: hello@arkynox.com
Address: Available upon request
Response Timeframe: All grievances are acknowledged within 24 hours and resolved within 15 calendar days from the date of receipt, as required by the DPDP Act and IT Rules 2021.

Scope of Grievance Redressal:
The Grievance Officer addresses complaints related to:
• Content or data on the Service that violates applicable law or these Terms
• Violations of user data rights under the DPDP Act 2023
• Data security or privacy breaches
• Account-related issues not resolved through standard channels
• Any other matter required under the IT Act, IT Rules 2021, or DPDP Act 2023

Grievance Submission Process:
1. Submit your grievance in writing to hello@arkynox.com with the subject line "Grievance: [brief description]"
2. Include your full name, email address used for the Service, a detailed description of the grievance, and any supporting documents or evidence
3. You will receive an acknowledgment within 24 hours
4. We will investigate and provide a resolution within 15 calendar days
5. If the grievance is not resolved to your satisfaction, you may escalate to the appropriate government authority under applicable Indian law`,
  },
  {
    title: '15. Data Protection Officer (GDPR)',
    content: `For users in the European Union and European Economic Area, Arkynox has appointed a Data Protection Officer (DPO) in accordance with Article 37 of the General Data Protection Regulation (GDPR). The DPO can be contacted at:

Email: dpo@arkynox.com

Responsibilities of the DPO (as per Article 39 GDPR):
• Monitoring compliance with the GDPR and other applicable data protection laws
• Informing and advising us of our data protection obligations
• Providing advice on Data Protection Impact Assessments (DPIAs) and monitoring their performance
• Acting as a contact point for data subjects regarding all matters related to processing of their personal data
• Cooperating with and acting as a contact point for data protection supervisory authorities

EU users have the right to lodge a complaint with their local data protection supervisory authority if they believe their data has been processed in violation of the GDPR. Relevant authorities include:
• France: Commission Nationale de l'Informatique et des Libertés (CNIL)
• Germany: Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)
• Ireland: Data Protection Commission (DPC)
• Netherlands: Autoriteit Persoonsgegevens (AP)
• United Kingdom: Information Commissioner's Office (ICO)`,
  },
  {
    title: '16. Jurisdiction-Specific Provisions',
    content: `INDIA:
These Terms comply with the Information Technology Act, 2000 (IT Act), the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP Act). Key compliance measures include:
• Data localization and cross-border transfer restrictions as applicable under the DPDP Act
• Consent mechanisms in compliance with the DPDP Act
• Grievance redressal as mandated by the IT Rules 2021 and DPDP Act
• Reasonable security practices as required by the IT Act, 2000
• Intermediary liability protections under Section 79 of the IT Act

EUROPEAN UNION / EEA:
For users in the EU/EEA, these Terms incorporate protections required by the General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679). This includes:
• Lawful basis for processing as set out in Article 6 GDPR (contractual necessity, legitimate interests, legal obligation)
• Data subject rights under Articles 15-22 GDPR (access, rectification, erasure, restriction, portability, objection, automated decision-making)
• Appropriate safeguards for international data transfers under Articles 44-49 GDPR, including Standard Contractual Clauses (SCCs)
• Data protection by design and by default under Article 25 GDPR
• Data breach notification under Articles 33-34 GDPR

UNITED KINGDOM:
For users in the United Kingdom, these Terms incorporate protections required by the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This includes:
• Lawful basis for processing as set out in Article 6 UK GDPR (contractual necessity, legitimate interests, legal obligation)
• Data subject rights under Articles 15-22 UK GDPR (access, rectification, erasure, restriction, portability, objection, automated decision-making)
• Appropriate safeguards for international data transfers under Articles 44-49 UK GDPR, including the UK International Data Transfer Agreement (IDTA) or UK Addendum to the EU SCCs
• Data protection by design and by default under Article 25 UK GDPR
• Data breach notification under Articles 33-34 UK GDPR
• Complaints can be lodged with the Information Commissioner's Office (ICO)

UNITED STATES:
For users in the United States, the following state-specific protections apply:
• California: California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA) (Cal. Civ. Code §§ 1798.100-1798.199). We do not "sell" or "share" personal information as defined under the CCPA.
• Virginia: Virginia Consumer Data Protection Act (CDPA) (Va. Code § 59.1-575 et seq.)
• Colorado: Colorado Privacy Act (CPA) (Colo. Rev. Stat. § 6-1-1301 et seq.)
• Connecticut: Connecticut Data Privacy Act (CTDPA) (Conn. Gen. Stat. § 42-515 et seq.)
• Utah: Utah Consumer Privacy Act (UCPA) (Utah Code § 13-61-101 et seq.)
• Other states: Texas (TDPSA), Oregon (OCPA), Iowa (ICDPA), Tennessee (TIPA), Montana (MCDPA), Delaware (DPDPA)

For users covered by these laws, we provide the rights and protections described in our Privacy Policy.

JAPAN:
For users in Japan, these Terms comply with the Act on the Protection of Personal Information (APPI, Act No. 57 of 2003, as amended). Key measures include:
• Appropriate handling of personal information as required by the APPI
• Designation of a person responsible for the management of personal information
• Measures for disclosure, correction, suspension of use, and deletion of retained personal data under Articles 28-33 of the APPI
• Complaint handling procedures as required by Article 35 of the APPI
• Compliance with cross-border transfer provisions under Article 28 of the APPI

BRAZIL:
For users in Brazil, these Terms comply with the Lei Geral de Proteção de Dados Pessoais (LGPD, Law No. 13,709/2018). Key measures include:
• Lawful bases for processing as set out in Article 7 LGPD (legal basis includes consent, legal obligation, public administration, research, contract execution, exercise of rights, health protection, credit protection, and legitimate interests)
• Data subject rights under Articles 17-22 LGPD (confirmation of existence, access, correction, anonymization, blocking, erasure, portability, information about sharing, non-consent consequences, review of automated decisions)
• The National Data Protection Authority (ANPD — Autoridade Nacional de Proteção de Dados) as the supervisory authority
• Appropriate technical and organizational measures for data protection under Article 46 LGPD
• Data breach notification obligations to the ANPD and affected data subjects under Article 48 LGPD

AUSTRALIA:
For users in Australia, these Terms comply with the Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles (APPs). Key measures include:
• Open and transparent management of personal information, including a clearly expressed and up-to-date privacy policy (APP 1)
• Anonymity and pseudonymity where practicable (APP 2)
• Collection of solicited personal information only where reasonably necessary for the Service, with notice of collection (APPs 3-5)
• Use and disclosure of personal information only for the primary purpose of collection or a related secondary purpose (APP 6)
• Direct marketing only in compliance with APP 7 (we do not engage in direct marketing)
• Cross-border data disclosure protections under APP 8, ensuring recipients have substantially similar data protection standards
• Adoption, use, and disclosure of government-related identifiers restricted under APP 9
• Quality and security obligations for personal information under APPs 10-11
• Access to and correction of personal information under APPs 12-13
• Compliance with the Notifiable Data Breaches (NDB) scheme under Part IIIC of the Privacy Act
• The Office of the Australian Information Commissioner (OAIC) as the supervisory authority

UAE:
For users in the United Arab Emirates, these Terms comply with the Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and its implementing regulations. Key measures include:
• Lawful bases for processing as set out in Article 4 of the PDPL (consent, contractual necessity, legal obligation, vital interests, legitimate interests)
• Data subject rights including the right to knowledge, access, correction, deletion, and objection (Articles 12-18 PDPL)
• Data protection impact assessments and privacy-by-design obligations
• Cross-border data transfer restrictions under Article 20 PDPL, requiring adequacy decisions or appropriate safeguards
• Appointment of a Data Protection Officer where required under Article 25 PDPL
• Data breach notification obligations to the UAE Data Office (formerly UAE Data Protection Office)
• The Telecommunications and Digital Government Regulatory Authority (TDRA) and the UAE Data Office as regulatory bodies
• For users in the Dubai International Financial Centre (DIFC), the DIFC Data Protection Law (DIFC Law No. 5 of 2020) and DIFC Commissioner of Data Protection apply
• For users in the Abu Dhabi Global Market (ADGM), the ADGM Data Protection Regulations 2021 apply

SAUDI ARABIA:
For users in the Kingdom of Saudi Arabia, these Terms comply with the Personal Data Protection Law (PDPL, Royal Decree M/19 of 2022, as amended) and its implementing regulations issued by the Saudi Data and Artificial Intelligence Authority (SDAIA). Key measures include:
• Lawful bases for processing including consent, contractual necessity, legal obligation, and legitimate interests under Article 6 PDPL
• Data subject rights including the right to knowledge, access, correction, destruction, and objection (Articles 23-27 PDPL)
• Data minimization and purpose limitation principles
• Cross-border data transfer restrictions under Article 29 PDPL, permitting transfers only where the recipient ensures adequate data protection or where an exception applies
• Data breach notification obligations to SDAIA and affected data subjects
• Appointment of a Data Protection Officer responsible for compliance
• Processing of sensitive data subject to stricter requirements under Article 9 PDPL
• The National Data Management Office (NDMO) and SDAIA as regulatory bodies overseeing data protection`,
  },
  {
    title: '17. Third-Party Links & Services',
    content: `The Service may contain links to third-party websites or services that are not owned or controlled by Arkynox. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.

Service Providers:
• Cloudflare Workers: We use Cloudflare's global edge network to execute distributed health checks. Cloudflare processes status data (up/down results, timestamps) on our behalf as a data processor under our instruction. Cloudflare does not have access to your stored credentials, connection URIs, or personal data. Cloudflare is certified under the EU-US Data Privacy Framework and the UK Extension to the Data Privacy Framework.
• MongoDB Atlas: We use MongoDB Atlas as our database provider. Your data is stored in MongoDB Atlas infrastructure located within the European Union. MongoDB acts as a data processor under our instruction.
• GitHub: Our source code is hosted on GitHub. Issue reports and contributions are governed by GitHub's Terms of Service.

If you access a third-party service through a link on our site, you do so at your own risk. We encourage you to review the terms and privacy policies of any third-party services you use.`,
  },
  {
    title: '18. Copyright & Intellectual Property',
    content: `Source Code License:
The Kaffeine source code is licensed under the Apache License 2.0. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions of the Apache License 2.0. The full license text is available at https://github.com/akkilmg/kaffeine/blob/main/LICENSE

Brand and Trademarks:
The "Kaffeine" name, the Kaffeine logo, the "Arkynox" name, and the Arkynox logo are trademarks or registered trademarks of Arkynox. You may not use these marks:
• In a way that suggests endorsement, sponsorship, or affiliation without prior written permission
• In connection with any product or service that is not the official Kaffeine service
• In any manner that could cause confusion, dilution, or damage to the brand
• In any commercial context without a license from Arkynox

Contributions:
Contributions to the Kaffeine project are made under the Apache License 2.0. By submitting a contribution (including but not limited to code, documentation, bug reports, feature requests, or comments), you agree that:
• Your contribution is your original work
• You grant Arkynox and all recipients of the software a perpetual, worldwide, non-exclusive, royalty-free, irrevocable license to use, reproduce, modify, distribute, and sublicense your contribution under the Apache License 2.0
• You waive any moral rights in your contribution to the fullest extent permitted by applicable law

Reporting Infringement:
If you believe that any content or material on the Service infringes your copyright, please contact our Grievance Officer at hello@arkynox.com with a detailed description of the alleged infringement.`,
  },
  {
    title: '19. Changes to Terms',
    content: `We may revise these Terms at any time to reflect changes in:
• The Service or its features
• Applicable laws, regulations, or legal requirements
• Our business practices or operational needs
• Feedback from users, regulators, or legal advisors

Process for Changes:
1. Changes will be effective immediately upon posting to this URL: /policy/terms
2. We will make reasonable efforts to notify registered users of material changes via email or through the Service dashboard at least 30 days before they take effect
3. The "Last updated" date at the top of this page will be updated to reflect the effective date of the changes
4. Your continued use of the Service after changes become effective constitutes your acceptance of the revised Terms
5. If you do not agree to the revised Terms, you must stop using the Service and delete your account before the changes take effect

We encourage you to review these Terms periodically. We will treat non-material changes (such as clarifications, formatting, or minor corrections) as effective upon posting.`,
  },
  {
    title: '20. Severability & Waiver',
    content: `Severability:
If any provision of these Terms is found to be unlawful, void, or unenforceable by a court or arbitrator of competent jurisdiction:
• That provision shall be deemed severed from these Terms
• The remaining provisions shall remain in full force and effect
• The unenforceable provision shall be replaced with a valid, enforceable provision that most closely reflects the original intent

Waiver:
Our failure to enforce any right, provision, or obligation under these Terms shall not be deemed a waiver of such right, provision, or obligation. No waiver shall be effective unless it is in writing and signed by an authorized representative of Arkynox.

No Assignment:
You may not assign, transfer, or delegate these Terms or any of your rights or obligations hereunder, by operation of law or otherwise, without our prior written consent. We may assign these Terms in whole or in part without restriction.

Relationship:
Nothing in these Terms shall be deemed to create a partnership, joint venture, agency, employment, or franchise relationship between you and Arkynox.`,
  },
  {
    title: '21. Entire Agreement',
    content: `These Terms, together with our Privacy Policy (https://kaffeine.arkynox.com/policy/privacy) and Cookie Policy (https://kaffeine.arkynox.com/policy/cookies), constitute the entire and exclusive agreement between you and Arkynox regarding your use of the Service, superseding and extinguishing all prior agreements, understandings, representations, and communications, whether written or oral.

In the event of any conflict or inconsistency between these documents, the following order of precedence shall apply:
1. These Terms of Service
2. Privacy Policy
3. Cookie Policy

If there is a conflict between the English version of these Terms and a translated version, the English version shall prevail.

These Terms do not create any third-party beneficiary rights in any person or entity.`,
  },
  {
    title: '22. Language & Translations',
    content: `These Terms are originally drafted in English. While we may provide translated versions for convenience, the English language version shall govern your use of the Service and any disputes arising from it.

If you are a consumer in the European Union, you have the right to receive these Terms in the official language of your EU member state. Please contact us at hello@arkynox.com to request a translation.

In the event of any inconsistency or discrepancy between the English version and a translated version, the English version shall prevail.`,
  },
  {
    title: '23. Contact Information',
    content: `If you have any questions, concerns, or requests regarding these Terms, please reach out through the appropriate channel:

General Inquiries: https://arkynox.com
Public Issue Tracker: https://github.com/akkilmg/kaffeine/issues
Security Vulnerabilities: https://github.com/akkilmg/kaffeine/blob/main/SECURITY.md

Designated Contacts (by jurisdiction):
• India (Grievance Officer - IT Act & DPDP Act): hello@arkynox.com
• European Union (Data Protection Officer - GDPR): dpo@arkynox.com
• United Kingdom (Data Protection Officer - UK GDPR): dpo@arkynox.com
• United States (Privacy Inquiries): privacy@arkynox.com
• Australia (Privacy Inquiries — Privacy Act 1988): privacy@arkynox.com
• Japan (Privacy Inquiries): privacy@arkynox.com
• Brazil (Privacy Inquiries - LGPD): privacy@arkynox.com
• UAE (Privacy Inquiries — PDPL): privacy@arkynox.com
• Saudi Arabia (Privacy Inquiries — PDPL): privacy@arkynox.com

We strive to respond to all inquiries within 48 hours. For grievance submissions, please allow up to 24 hours for acknowledgment and up to 15 calendar days for resolution as required by Indian law.`,
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
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-base text-muted-foreground">
            Last updated: June 11, 2026
          </p>
          <p className="text-sm text-muted-foreground/60 mt-2">
            Governed by the laws of India. Covers India (IT Act 2000, DPDP Act 2023), EU (GDPR), UK (UK GDPR), US (CCPA/CPRA, state laws), Australia (Privacy Act 1988), Japan (APPI), Brazil (LGPD), UAE (PDPL), Saudi Arabia (PDPL).
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
            These Terms of Service are provided for informational purposes and do not constitute legal advice. If you have specific legal concerns, please consult a qualified attorney licensed in your jurisdiction. As an open-source project, we believe in radical transparency — every line of our code is public and independently verifiable. Our complete source code is available on{' '}
            <Link href="https://github.com/akkilmg/kaffeine" target="_blank" className="text-primary hover:underline">GitHub</Link>.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
