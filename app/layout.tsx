import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { GoogleAnalyticsScript } from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'PDF Tools - Free Online PDF Editor & Converter',
    template: '%s | PDF Tools',
  },
  description:
    'Free online PDF tools for merging, splitting, compressing, and converting PDF files. Fast, secure, and private - all processing happens in your browser.',
  keywords: [
    'PDF tools',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'PDF to Word',
    'Word to PDF',
    'PDF converter',
    'online PDF editor',
    'free PDF tools',
  ],
  authors: [{ name: 'PDF Tools' }],
  creator: 'PDF Tools',
  publisher: 'PDF Tools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdftools.com',
    siteName: 'PDF Tools',
    title: 'PDF Tools - Free Online PDF Editor & Converter',
    description:
      'Free online PDF tools for merging, splitting, compressing, and converting PDF files. Fast, secure, and private.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PDF Tools - Free Online PDF Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools - Free Online PDF Editor & Converter',
    description:
      'Free online PDF tools for merging, splitting, compressing, and converting PDF files. Fast, secure, and private.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalyticsScript />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}