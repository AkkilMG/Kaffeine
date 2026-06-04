import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kaffeine.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/admin/'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
