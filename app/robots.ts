import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/test-upload/'],
    },
    sitemap: 'https://pdftools.com/sitemap.xml',
  };
}