import { Metadata } from 'next';
import SplitPDFClient from './SplitPDFClient';

export const metadata: Metadata = {
  title: 'Split PDF Files Online - Free PDF Splitter Tool',
  description: 'Split PDF files by pages, ranges, or extract specific pages for free. Fast, secure, and easy to use. All processing happens in your browser.',
  keywords: [
    'split PDF',
    'PDF splitter',
    'extract PDF pages',
    'divide PDF',
    'separate PDF pages',
    'PDF page extractor',
    'split PDF online',
    'free PDF splitter',
  ],
  openGraph: {
    title: 'Split PDF Files Online - Free PDF Splitter Tool',
    description: 'Split PDF files by pages, ranges, or extract specific pages for free. Fast, secure, and easy to use.',
    url: '/split-pdf',
    images: [
      {
        url: '/og-images/split-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'Split PDF Files Online',
      },
    ],
  },
};

export default function SplitPDFPage() {
  return <SplitPDFClient />;
}