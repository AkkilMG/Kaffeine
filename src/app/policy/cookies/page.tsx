'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PolicyContent } from '@/components/policy-content';

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
    title: '1. Our Approach to Cookies',
    content: `At Kaffeine, we believe in privacy by default and privacy by design. Our approach to cookies is simple: we use the absolute minimum required for security and authentication — nothing more.

We do not use any:
• Tracking cookies, advertising cookies, or analytics cookies
• Fingerprinting techniques, canvas fingerprinting, or device identification
• Third-party cookies, social media tracking pixels, or embedded widgets
• Session replay, heatmaps, or user behavior analytics
• Any other technology that could be used to track your online activity

This Cookie Policy explains how and why we use cookies and similar technologies. It is designed to comply with applicable laws across all jurisdictions where our users are located, including:
• EU: ePrivacy Directive (2002/58/EC) and General Data Protection Regulation (GDPR)
• UK: Privacy and Electronic Communications Regulations (PECR) 2003 and UK General Data Protection Regulation (UK GDPR)
• India: Information Technology Act, 2000 and Digital Personal Data Protection Act, 2023
• US: California Consumer Privacy Act (CCPA/CPRA) and applicable state privacy laws
• Australia: Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles (APPs); the OAIC's guidelines on cookies and tracking technologies
• Japan: Act on the Protection of Personal Information (APPI)
• Brazil: Lei Geral de Proteção de Dados Pessoais (LGPD, Law No. 13,709/2018)
• UAE: Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL); Telecommunications and Digital Government Regulatory Authority (TDRA) guidelines
• Saudi Arabia: Personal Data Protection Law (PDPL, Royal Decree M/19 of 2022); implementing regulations from the Saudi Data and Artificial Intelligence Authority (SDAIA)

Because we use only strictly necessary cookies, this policy serves our transparency obligations — not a consent requirement, as none is needed under applicable law.`,
  },
  {
    title: '2. What Are Cookies?',
    content: `Cookies are small text files stored on your device by your web browser. They are widely used to make websites work efficiently, provide essential functionality such as authentication and session management, and improve the user experience.

Types of Cookies:
• Session Cookies: Temporary cookies that are deleted when you close your browser. They do not persist beyond your browsing session.
• Persistent Cookies: Cookies that remain on your device until they expire or are explicitly deleted by you. They allow websites to remember your preferences or login state across sessions.

Other Storage Mechanisms:
• localStorage: A browser storage mechanism that persists data on your device across sessions. Unlike cookies, localStorage data is not automatically transmitted to servers with every HTTP request.
• sessionStorage: Similar to localStorage but cleared when the browsing session ends.

Kaffeine uses one persistent HTTP cookie and one localStorage entry — both strictly necessary for the Service to function.`,
  },
  {
    title: '3. Cookies We Use',
    content: `Kaffeine sets exactly one HTTP cookie. Here is the complete technical specification:

session (HTTP Cookie):
• Purpose: Authentication — keeps you logged into your account while navigating the Service
• Type: Strictly necessary (essential). Without this cookie, user authentication would be impossible
• Category: Persistent — expires after 7 days of inactivity, or immediately upon logout
• Content: A cryptographically signed JSON Web Token (JWT) containing your user ID, email address, and assigned role
• Security attributes:
  - HTTP-only: True — the cookie is inaccessible to JavaScript, preventing XSS (Cross-Site Scripting) attacks
  - Secure: True in production — the cookie is only sent over HTTPS connections
  - SameSite: Strict — the cookie is only sent for same-site requests, preventing CSRF (Cross-Site Request Forgery) attacks
  - Path: / — the cookie is sent for all requests to the domain
  - Domain: Set to the exact origin domain
• Third-party access: None — this cookie is set by and accessible only to Kaffeine

We also use localStorage (client-side storage, never transmitted to servers):
• Key: theme
• Value: "light" or "dark"
• Purpose: Stores your theme preference so that your chosen appearance (light or dark mode) persists across browser sessions
• Duration: Persistent until cleared by the user
• Server access: None — this data stays on your device and is never sent to our servers

What We Do NOT Store or Set:
• No cookies for analytics, tracking, advertising, or any non-essential purpose
• No third-party cookies whatsoever
• No cookies from CDNs, font services, or external resources
• No sessionStorage or IndexedDB data for tracking purposes`,
  },
  {
    title: '4. No Third-Party Cookies or Trackers',
    content: `Kaffeine does not embed, load, or execute any third-party scripts, widgets, resources, or services that could set cookies, track users, or collect personal data.

Specifically, we do not use:
• Google Analytics, Plausible, Fathom, Umami, Matomo, or any analytics service (self-hosted or otherwise)
• Facebook Pixel, Twitter Pixel, LinkedIn Insight Tag, Microsoft Clarity, Hotjar, or any advertising or tracking pixels
• Google Fonts, Adobe Fonts, or any externally hosted font services (we self-host all fonts)
• CDN-hosted JavaScript libraries (we bundle all scripts with our application)
• Disqus, Commento, or any comment or discussion systems
• Intercom, Crisp, Tawk.to, or any live chat or customer support widgets
• Social media share buttons, "Like" buttons, or embedded social media feeds
• Any server-side tracking, log analysis for marketing purposes, or user session recording

We believe that web browsing activity between you and Kaffeine should remain between you and Kaffeine. Our approach is to handle everything ourselves, without intermediaries that could introduce tracking or privacy risks.`,
  },
  {
    title: '5. Legal Basis & Consent',
    content: `Because Kaffeine uses only strictly necessary cookies that are essential for the operation of the Service:

EU (ePrivacy Directive & GDPR):
• Strictly necessary cookies are exempt from the consent requirements under Article 5(3) of the ePrivacy Directive (2002/58/EC) as implemented by each EU member state
• No cookie consent banner or opt-in is required for strictly necessary cookies
• This Cookie Policy fulfills our transparency obligations under Article 5(1)(a) GDPR (lawfulness, fairness, and transparency)

India (IT Act & DPDP Act):
• Our cookie practices comply with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023
• Since we process only essential data, no additional consent is required beyond the consent provided during account registration

United Kingdom (PECR & UK GDPR):
• Strictly necessary cookies are exempt from consent requirements under Regulation 6 of the Privacy and Electronic Communications Regulations (PECR) 2003
• No cookie consent banner or opt-in is required for strictly necessary cookies
• This Cookie Policy fulfills our transparency obligations under Article 5(1)(a) UK GDPR

United States (CCPA & State Laws):
• Our use of cookies does not constitute "sale" or "sharing" of personal information as defined under the CCPA/CPRA or other US state privacy laws
• We do not engage in cross-context behavioral advertising
• We do not use cookies for any purpose that would trigger an opt-out right under applicable state laws

Japan (APPI):
• Our cookie practices comply with the Act on the Protection of Personal Information (APPI)
• We handle personal information appropriately and have measures in place for disclosure, correction, and suspension of use requests as required

Australia (Privacy Act 1988):
• Our cookie practices comply with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth)
• Since our session cookie collects only essential authentication data and no tracking occurs, our practices align with APP 3 (collection of solicited personal information) and APP 6 (use and disclosure)
• The OAIC's guidelines on cookies confirm that strictly necessary cookies are generally exempt from additional consent requirements where no tracking or profiling occurs
• Users retain the right to access and correct any personal information held through account settings

UAE (PDPL):
• Our cookie practices comply with Federal Decree-Law No. 45 of 2021 (PDPL) and the TDRA guidelines
• The session cookie is used for the essential purpose of authentication, which falls within the lawful basis of contractual necessity (Article 4(2) PDPL)
• Since we process only strictly necessary cookies with no tracking, profiling, or advertising purposes, no additional consent is required beyond what is provided during account registration
• Users have the right to object to processing under Article 17 PDPL, though processing for authentication is necessary for the Service to function

Saudi Arabia (PDPL):
• Our cookie practices comply with the Personal Data Protection Law (Royal Decree M/19 of 2022) and SDAIA implementing regulations
• The session cookie processes personal data only for the purpose of authentication, which is necessary for the performance of the Service under Article 6 PDPL
• Since we do not use cookies for tracking, profiling, or advertising, no additional consent is required beyond the consent provided during registration
• Users have the right to object to processing under Article 26 PDPL, subject to the requirements of the PDPL

Consent Decision:
If we ever need to introduce non-essential cookies (such as for optional features), we will:
1. Obtain your freely given, specific, informed, and unambiguous consent before setting any such cookies
2. Provide clear information about the purpose and duration of each cookie
3. Allow you to withdraw consent at any time with the same ease as it was given
4. Update this Cookie Policy and the cookie inventory in Section 7`,
  },
  {
    title: '6. Your Cookie Choices',
    content: `While our strictly necessary cookie does not require consent, we respect your right to control what is stored on your device.

Browser Settings:
Most browsers allow you to manage cookie settings, including blocking or deleting cookies. However, please note:
• Blocking all cookies will prevent you from logging into Kaffeine and using the dashboard
• The session cookie is essential for authentication — without it, the Service cannot function
• localStorage data (theme preference) can be cleared without affecting functionality

Browser-Specific Instructions:
• Google Chrome: Settings → Privacy and Security → Cookies and other site data
• Mozilla Firefox: Options → Privacy & Security → Cookies and Site Data
• Apple Safari: Preferences → Privacy → Cookies and website data
• Microsoft Edge: Settings → Cookies and site permissions → Manage and delete cookies and site data

How to Clear Kaffeine Data:
• Clearing your session cookie: Log out of your account — this immediately invalidates and deletes the session cookie
• Deleting your account: Go to Dashboard → Settings → Delete Account — this will permanently delete all your data
• Clearing localStorage: Use your browser's Developer Tools (F12) → Application → Local Storage → Clear All

Our Commitment:
• We do not use "cookie walls" or condition access to the Service on accepting cookies
• We do not use "dark patterns" to manipulate cookie choices
• We do not reset cookie preferences without user action
• We honor Do Not Track (DNT) signals (see Section 8)`,
  },
  {
    title: '7. Cookie Inventory',
    content: `For complete transparency, here is the full technical inventory of all cookies and browser storage used by Kaffeine:

| Name | Type | Category | Purpose | Duration | HTTP-only | Secure | SameSite | Third-Party Access |
|------|------|----------|---------|----------|-----------|--------|----------|-------------------|
| session | HTTP Cookie | Strictly Necessary | Authentication (JWT-signed session token) | 7 days (or until logout) | Yes | Yes (production) | Strict | No |
| theme | localStorage | Browser Storage | Theme preference (light/dark mode) | Permanent (until cleared) | N/A | N/A | N/A | No |

Total cookies set by Kaffeine: 1 (session)
Total third-party cookies: 0
Total tracking mechanisms: 0

Commitment to Future Changes:
We reserve the right to introduce additional strictly necessary cookies if required for new security features or essential functionality. If we do:
• The change will be documented in this Cookie Policy
• The new cookie will be listed in the inventory table above
• We will clearly explain the cookie's purpose, duration, and technical attributes
• Registered users will be notified via email of any material changes to our cookie practices

We will never introduce non-essential, tracking, advertising, or analytics cookies without obtaining your explicit prior consent.`,
  },
  {
    title: '8. Do Not Track (DNT) & Global Privacy Control',
    content: `Kaffeine respects all privacy preference signals sent by your browser.

Do Not Track (DNT):
• We fully support and honor the Do Not Track (DNT) HTTP header (specified in W3C Tracking Preference Expression (DNT))
• When your browser sends a DNT: 1 signal, we ensure that no non-essential tracking occurs
• Since we do not engage in any form of tracking regardless of the DNT signal, all users receive the same privacy-protective experience
• This commitment applies globally — regardless of whether you are in India, the EU, the US, Japan, or any other jurisdiction

Global Privacy Control (GPC):
• We support the Global Privacy Control (GPC) signal, which communicates your privacy preferences to websites
• When your browser sends a GPC signal, we honor it as an opt-out of any sale or sharing of personal information
• Since we do not sell or share personal information, the GPC signal is automatically satisfied by our existing practices
• GPC is recognized under the CCPA/CPRA and other US state privacy laws as a valid opt-out signal

No Browser Signal Limitations:
• Our privacy practices are not dependent on browser signals — we maintain the same privacy standards for all users
• Even without DNT or GPC, we collect only the minimum data necessary and never engage in tracking`,
  },
  {
    title: '9. Cross-Jurisdiction Compliance',
    content: `This Cookie Policy is designed to comply with cookie and privacy laws across all major jurisdictions where our users are located.

European Union (ePrivacy Directive & GDPR):
• Compliance with Article 5(3) of the ePrivacy Directive (2002/58/EC) regarding storage of and access to information on user devices
• Transparency obligations under Article 5(1)(a) GDPR
• Data protection by design and by default under Article 25 GDPR
• Strictly necessary exemption is applied correctly

India (IT Act, 2000 & DPDP Act, 2023):
• Reasonable security practices under the IT (Reasonable Security Practices) Rules, 2011
• Data minimization principles under the DPDP Act, 2023
• Grievance redressal mechanism for data-related complaints
• Transparency in data processing as required under the DPDP Act

United Kingdom (PECR & UK GDPR):
• Compliance with Regulation 6 of the Privacy and Electronic Communications Regulations (PECR) 2003 regarding storage of and access to information on terminal equipment
• Transparency obligations under Article 5(1)(a) UK GDPR
• Data protection by design and by default under Article 25 UK GDPR
• Strictly necessary exemption is applied correctly
• Complaints can be lodged with the Information Commissioner's Office (ICO)

United States:
• California: Full compliance with CCPA/CPRA — no sale or sharing of personal information through cookies
• Virginia (CDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), and other state laws: No use of cookies for targeted advertising, profiling, or other purposes that would trigger consumer rights under these laws
• COPPA: No collection of personal information from children under 13 through cookies or other means
• FTC Guidelines: Transparent disclosure of cookie practices in compliance with FTC guidance on online tracking

Japan (APPI):
• Compliance with the Act on the Protection of Personal Information (Act No. 57 of 2003) as amended
• Appropriate handling of personal information obtained through our session cookie
• Transparency regarding purpose of use and retention period
• Compliance with cross-border transfer provisions under Article 28 of the APPI

Brazil (LGPD):
• Compliance with the Lei Geral de Proteção de Dados Pessoais (Law No. 13,709/2018)
• Data minimization principles under Article 6 LGPD
• Transparency regarding processing activities under Article 9 LGPD
• Rights of data subjects under Articles 17-22 LGPD regarding personal data collected through cookies
• Compliance with the National Data Protection Authority (ANPD) guidelines on cookies and tracking technologies

Australia (Privacy Act 1988):
• Compliance with the 13 Australian Privacy Principles under the Privacy Act 1988 (Cth)
• APP 1 — Open and transparent management of personal information: this Cookie Policy serves as our transparency mechanism
• APP 3 — Collection of solicited personal information: only essential authentication data is collected
• APP 5 — Notification of collection: this Cookie Policy provides clear notice
• APP 6 — Use and disclosure: limited solely to authentication
• APP 11 — Security of personal information: the session cookie is transmitted via HTTPS with HTTP-only, Secure, and SameSite=Strict attributes
• Compliance with the OAIC's guidelines on the use of cookies and tracking technologies (2023)
• The Notifiable Data Breaches (NDB) scheme applies if a breach of session data occurs

UAE (PDPL):
• Compliance with Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL)
• Lawful basis for processing: contractual necessity under Article 4(2) PDPL (authentication is essential for the Service)
• Data minimization and purpose limitation principles observed
• Transparency as required under Article 12 PDPL (right to knowledge)
• Cross-border cookie data transfer protections under Article 20 PDPL
• For DIFC users: compliance with DIFC Data Protection Law (DIFC Law No. 5 of 2020) — strictly necessary cookies are permitted
• For ADGM users: compliance with ADGM Data Protection Regulations 2021 — processing necessary for performance of contract

Saudi Arabia (PDPL):
• Compliance with the Personal Data Protection Law (Royal Decree M/19 of 2022) and SDAIA implementing regulations
• Lawful basis for processing: contractual necessity under Article 6 PDPL (authentication is essential for the Service)
• Data minimization and purpose limitation principles observed as required
• Transparency under Article 23 PDPL — this policy serves as notice of data collection via cookies
• Data subject rights under Articles 24-27 PDPL apply to session data (access, correction, destruction, objection)
• Cross-border transfer protections under Article 29 PDPL apply where cookie data may be transferred`,
  },
  {
    title: '10. Updates to This Policy',
    content: `We may update this Cookie Policy to reflect changes in:
• Our use of cookies and similar technologies (including the introduction of new strictly necessary cookies)
• Applicable laws, regulations, or regulatory guidance regarding cookies and online tracking
• Industry best practices for cookie compliance and user transparency
• Feedback from users, privacy advocates, or regulators

Process for Changes:
1. Changes will be posted on this page with an updated "Last updated" date
2. Material changes to our cookie practices (such as the introduction of new cookies) will be communicated via email to registered users
3. Non-material changes (formatting, clarifications, corrections) will be effective immediately upon posting
4. We encourage you to review this policy periodically

Future Non-Essential Cookies:
If we ever propose to introduce non-essential cookies — for any purpose — we will:
1. First obtain your explicit, informed consent
2. Document the cookie in the inventory table in Section 7
3. Provide a clear explanation of its purpose, duration, and third-party access (if any)
4. Give you the ability to withdraw consent at any time`,
  },
  {
    title: '11. Contact',
    content: `If you have any questions, concerns, or requests regarding our use of cookies, please reach out:

Privacy & Cookie Inquiries: support@arkynox.com
Grievance Officer (India — IT Act & DPDP Act): support@arkynox.com
Data Protection Officer (EU — GDPR): support@arkynox.com
Data Protection Officer (UK — UK GDPR): support@arkynox.com
Australia (Privacy Inquiries — Privacy Act 1988): support@arkynox.com
UAE (Privacy Inquiries — PDPL): support@arkynox.com
Saudi Arabia (Privacy Inquiries — PDPL): support@arkynox.com
Public Issue Tracker: https://github.com/akkilmg/kaffeine/issues
Security Vulnerabilities: https://github.com/akkilmg/kaffeine/blob/main/SECURITY.md

We strive to respond to all cookie-related inquiries within 48 hours. As an open-source project, our entire implementation of authentication, session management, and cookie handling is visible in our public source code at https://github.com/akkilmg/kaffeine. We invite you to verify our claims independently.`,
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
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Cookie <span className="text-primary">Policy</span>
          </h1>
          <p className="text-base text-muted-foreground">
            Last updated: June 11, 2026
          </p>
          <p className="text-sm text-muted-foreground/60 mt-2">
            Compliant with EU ePrivacy Directive & GDPR, UK PECR & UK GDPR, India IT Act & DPDP Act, US CCPA & state laws, Australia Privacy Act 1988, Japan APPI, Brazil LGPD, UAE PDPL, Saudi Arabia PDPL.
          </p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((section) => (
            <motion.div key={section.title} variants={fadeIn}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
              <PolicyContent content={section.content} />
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeIn} className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Kaffeine takes a privacy-first approach to cookies. We use the absolute minimum required for security and authentication — nothing more. Our source code is open, so our cookie practices can be independently verified by anyone. Visit our{' '}
            <Link href="https://github.com/akkilmg/kaffeine" target="_blank" className="text-primary hover:underline">GitHub repository</Link> to audit our implementation.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
