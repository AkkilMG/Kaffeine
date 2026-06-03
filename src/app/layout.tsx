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

export const metadata: Metadata = {
  title: {
    default: 'Kaffeine - Free & Open Source Uptime Monitoring',
    template: '%s | Kaffeine',
  },
  description: 'Free and open-source uptime monitoring for websites and databases. End-to-end encrypted health checks with real-time alerts, detailed analytics, and Cloudflare-powered distributed monitoring.',
  keywords: ['uptime monitoring', 'website monitoring', 'database monitoring', 'open source', 'free', 'encrypted', 'health checks', 'status page'],
  openGraph: {
    title: 'Kaffeine - Free & Open Source Uptime Monitoring',
    description: 'Monitor your websites and databases with end-to-end encrypted health checks. Free, open source, and privacy-first.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Kaffeine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaffeine - Free & Open Source Uptime Monitoring',
    description: 'Monitor your websites and databases with end-to-end encrypted health checks. Free, open source, and privacy-first.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5E6D3' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
