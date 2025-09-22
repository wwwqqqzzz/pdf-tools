import { Metadata } from 'next';
import CompressPDFClient from './CompressPDFClient';

export const metadata: Metadata = {
  title: 'Compress PDF Files Online - Free PDF Compressor Tool',
  description: 'Reduce PDF file size online for free. Compress PDF files without losing quality. Fast, secure, and easy to use.',
  keywords: [
    'compress PDF',
    'PDF compressor',
    'reduce PDF size',
    'PDF optimizer',
    'shrink PDF',
    'compress PDF online',
    'free PDF compressor',
    'PDF size reducer',
  ],
  openGraph: {
    title: 'Compress PDF Files Online - Free PDF Compressor Tool',
    description: 'Reduce PDF file size online for free. Compress PDF files without losing quality.',
    url: '/compress-pdf',
    images: [
      {
        url: '/og-images/compress-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'Compress PDF Files Online',
      },
    ],
  },
};

export default function CompressPDFPage() {
  return <CompressPDFClient />;
}