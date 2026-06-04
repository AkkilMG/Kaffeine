import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kaffeine.dev';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Kaffeine - Free & Open Source Uptime Monitoring',
    template: '%s | Kaffeine',
  },
  description: 'Free and open-source uptime monitoring for websites and databases. End-to-end encrypted health checks with real-time alerts, detailed analytics, and Cloudflare-powered distributed monitoring.',
  keywords: ['uptime monitoring', 'website monitoring', 'free monitoring tool', 'open source monitoring', 'database monitoring', 'health checks', 'status page', 'downtime alerts'],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'Kaffeine - Free & Open Source Uptime Monitoring',
    description: 'Monitor your websites and databases with end-to-end encrypted health checks. Free, open source, and privacy-first.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Kaffeine',
    url: baseUrl,
    images: [{ url: `${baseUrl}/assets/logo/logo.png`, width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaffeine - Free & Open Source Uptime Monitoring',
    description: 'Monitor your websites and databases with end-to-end encrypted health checks. Free, open source, and privacy-first.',
    images: [`${baseUrl}/assets/logo/logo.png`],
  },
  icons: {
    icon: [
      { url: '/assets/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/assets/logo/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5E6D3' },
    { media: '(prefers-color-scheme: dark)', color: '#2C1810' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Kaffeine',
      url: baseUrl,
      description: 'Free and open-source uptime monitoring for websites and databases.',
      logo: `${baseUrl}/assets/logo/logo.png`,
      sameAs: ['https://github.com/akkilmg/kaffeine'],
    },
    {
      '@type': 'WebSite',
      name: 'Kaffeine',
      url: baseUrl,
      description: 'Free and open-source uptime monitoring. HTTP/HTTPS checks, database monitoring, real-time alerts, and detailed analytics.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${baseUrl}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Kaffeine',
      operatingSystem: 'Web',
      applicationCategory: 'WebApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free, open-source uptime monitoring for websites and databases. End-to-end encrypted health checks with real-time alerts.',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
