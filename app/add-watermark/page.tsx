import { Metadata } from 'next';
import AddWatermarkClient from './AddWatermarkClient';

export const metadata: Metadata = {
  title: 'Add Watermark to PDF - Free Online PDF Watermark Tool',
  description: 'Add text or image watermarks to PDF files online for free. Protect your documents with custom watermarks. Fast, secure, and private.',
  keywords: 'add watermark to PDF, PDF watermark, watermark PDF, protect PDF, PDF security, free PDF watermark tool',
  openGraph: {
    title: 'Add Watermark to PDF - Free Online Tool',
    description: 'Add text or image watermarks to PDF files online for free. Protect your documents with custom watermarks.',
    type: 'website',
  },
};

export default function AddWatermarkPage() {
  return <AddWatermarkClient />;
}