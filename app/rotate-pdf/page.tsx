import { Metadata } from 'next';
import RotatePDFClient from './RotatePDFClient';

export const metadata: Metadata = {
  title: 'Rotate PDF - Free Online PDF Rotation Tool',
  description: 'Rotate PDF pages online for free. Fix page orientation and rotate PDF documents 90, 180, or 270 degrees. Fast, secure, and private.',
  keywords: 'rotate PDF, PDF rotation, fix PDF orientation, rotate PDF pages, free PDF rotation tool',
  openGraph: {
    title: 'Rotate PDF - Free Online PDF Rotation Tool',
    description: 'Rotate PDF pages online for free. Fix page orientation and rotate PDF documents easily.',
    type: 'website',
  },
};

export default function RotatePDFPage() {
  return <RotatePDFClient />;
}