// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://aambish.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/profile', '/cart', '/checkout', '/thankyou'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
