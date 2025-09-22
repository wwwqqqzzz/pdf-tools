import { PDFDocument } from 'pdf-lib';

export class PDFProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFProcessingError';
  }
}

export async function loadPDFDocument(file: File): Promise<PDFDocument> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc;
  } catch (error) {
    throw new PDFProcessingError(`Failed to load PDF document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validatePDFFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File must be a PDF' };
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }

  return { isValid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateFileName(originalName: string, suffix: string): string {
  const nameWithoutExt = originalName.replace(/\.pdf$/i, '');
  return `${nameWithoutExt}_${suffix}.pdf`;
}