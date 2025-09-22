import { Metadata } from 'next';
import WordToPDFClient from './WordToPDFClient';

export const metadata: Metadata = {
  title: 'Word to PDF Converter - Free Online DOC/DOCX to PDF Converter',
  description: 'Convert Word documents to PDF online for free. Transform DOC, DOCX, and TXT files to PDF format. Fast, secure, and private conversion.',
  keywords: 'Word to PDF, DOC to PDF, DOCX to PDF, convert Word to PDF, Word converter, free Word to PDF converter',
  openGraph: {
    title: 'Word to PDF Converter - Free Online Tool',
    description: 'Convert Word documents to PDF online for free. Transform DOC, DOCX, and TXT files to PDF format.',
    type: 'website',
  },
};

export default function WordToPDFPage() {
  return <WordToPDFClient />;
}