export enum PDFToolType {
  MERGE = 'merge-pdf',
  SPLIT = 'split-pdf',
  COMPRESS = 'compress-pdf',
  PDF_TO_WORD = 'pdf-to-word',
  WORD_TO_PDF = 'word-to-pdf',
  PDF_TO_JPG = 'pdf-to-jpg',
  JPG_TO_PDF = 'jpg-to-pdf',
  ROTATE = 'rotate-pdf',
  WATERMARK = 'add-watermark',
}

export interface ProcessingOptions {
  quality?: 'low' | 'medium' | 'high';
  compression?: number;
  pageRange?: { start: number; end: number };
  watermark?: {
    text: string;
    position: 'center' | 'corner';
    opacity: number;
  };
  rotation?: 90 | 180 | 270;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: ProcessedFile;
  error?: string;
}

export interface ProcessedFile {
  name: string;
  size: number;
  url: string;
  type: string;
  pages?: number;
}

export interface PDFFile {
  file: File;
  name: string;
  size: number;
  pages: number;
  preview?: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'ready' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export interface PDFProcessorConfig {
  maxFileSize: number;
  maxFiles: number;
  supportedTypes: string[];
  processingTimeout: number;
}