import { Metadata } from 'next';
import SimpleMergePDFClient from './SimpleMergePDFClient';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online - Free PDF Merger Tool',
  description: 'Combine multiple PDF files into one document for free. Fast, secure, and easy to use. All processing happens in your browser - no file uploads required.',
  keywords: [
    'merge PDF',
    'combine PDF',
    'PDF merger',
    'join PDF files',
    'merge PDF online',
    'free PDF merger',
    'combine PDF files',
    'PDF joiner',
  ],
  openGraph: {
    title: 'Merge PDF Files Online - Free PDF Merger Tool',
    description: 'Combine multiple PDF files into one document for free. Fast, secure, and easy to use.',
    url: '/merge-pdf',
    images: [
      {
        url: '/og-images/merge-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'Merge PDF Files Online',
      },
    ],
  },
};

export default function MergePDFPage() {
  return <SimpleMergePDFClient />;
}