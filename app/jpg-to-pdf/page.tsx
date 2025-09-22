import { Metadata } from 'next';
import JPGToPDFClient from './JPGToPDFClient';

export const metadata: Metadata = {
  title: 'JPG to PDF Converter - Free Online Image to PDF Converter',
  description: 'Convert JPG images to PDF online for free. Combine multiple images into a single PDF document. Fast, secure, and private conversion.',
  keywords: 'JPG to PDF, image to PDF, convert JPG to PDF, image converter, free JPG to PDF converter',
  openGraph: {
    title: 'JPG to PDF Converter - Free Online Tool',
    description: 'Convert JPG images to PDF online for free. Combine multiple images into a single PDF document.',
    type: 'website',
  },
};

export default function JPGToPDFPage() {
  return <JPGToPDFClient />;
}