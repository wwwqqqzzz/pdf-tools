import { PDFToolType } from './pdf';

export interface PDFTool {
  id: PDFToolType;
  name: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  category: 'convert' | 'edit' | 'optimize';
  features: string[];
  limitations?: string[];
}

export interface ToolConfig {
  maxFileSize: number;
  maxFiles: number;
  supportedInputTypes: string[];
  supportedOutputTypes: string[];
  processingOptions?: ProcessingOptionConfig[];
}

export interface ProcessingOptionConfig {
  key: string;
  label: string;
  type: 'select' | 'range' | 'checkbox' | 'text';
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  default?: string | number | boolean;
}

export interface ToolMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  structuredData?: Record<string, any>;
}