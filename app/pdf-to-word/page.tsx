import { Metadata } from 'next';
import PDFToWordClient from './PDFToWordClient';

export const metadata: Metadata = {
  title: 'PDF to Word Converter - Free Online PDF to DOC/DOCX Converter',
  description: 'Convert PDF files to Word documents online for free. Extract text from PDF and save as DOC or DOCX format. Fast, secure, and private conversion.',
  keywords: 'PDF to Word, PDF to DOC, PDF to DOCX, convert PDF to Word, PDF converter, free PDF to Word converter',
  openGraph: {
    title: 'PDF to Word Converter - Free Online Tool',
    description: 'Convert PDF files to Word documents online for free. Extract text from PDF and save as DOC or DOCX format.',
    type: 'website',
  },
};

export default function PDFToWordPage() {
  return <PDFToWordClient />;
}