import { Metadata } from 'next';
import PDFToJPGClient from './PDFToJPGClient';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter - Free Online PDF to Image Converter',
  description: 'Convert PDF pages to JPG images online for free. Extract high-quality images from PDF documents. Fast, secure, and private conversion.',
  keywords: 'PDF to JPG, PDF to image, convert PDF to JPG, PDF converter, free PDF to image converter',
  openGraph: {
    title: 'PDF to JPG Converter - Free Online Tool',
    description: 'Convert PDF pages to JPG images online for free. Extract high-quality images from PDF documents.',
    type: 'website',
  },
};

export default function PDFToJPGPage() {
  return <PDFToJPGClient />;
}