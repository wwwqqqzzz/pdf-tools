import { FILE_CONFIG } from '@/lib/config/constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFileType(file: File, allowedTypes: string[]): ValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  return { isValid: true };
}

export function validateFileSize(file: File, maxSize: number = FILE_CONFIG.maxFileSize): ValidationResult {
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    const fileSizeMB = Math.round(file.size / (1024 * 1024));
    return {
      isValid: false,
      error: `File size ${fileSizeMB}MB exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }
  return { isValid: true };
}

export function validateFileCount(files: File[], maxFiles: number = FILE_CONFIG.maxFiles): ValidationResult {
  if (files.length > maxFiles) {
    return {
      isValid: false,
      error: `Too many files. Maximum allowed: ${maxFiles}, provided: ${files.length}`,
    };
  }
  return { isValid: true };
}

export function validateFile(file: File, allowedTypes: string[], maxSize?: number): ValidationResult {
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.isValid) return typeValidation;

  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.isValid) return sizeValidation;

  return { isValid: true };
}

export function validateFiles(files: File[], allowedTypes: string[], maxFiles?: number, maxSize?: number): ValidationResult {
  const countValidation = validateFileCount(files, maxFiles);
  if (!countValidation.isValid) return countValidation;

  for (const file of files) {
    const fileValidation = validateFile(file, allowedTypes, maxSize);
    if (!fileValidation.isValid) return fileValidation;
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

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isValidPDF(file: File): boolean {
  return file.type === 'application/pdf' || getFileExtension(file.name).toLowerCase() === 'pdf';
}

export function isValidImage(file: File): boolean {
  return FILE_CONFIG.supportedImageTypes.includes(file.type);
}

export function isValidDocument(file: File): boolean {
  return FILE_CONFIG.supportedDocTypes.includes(file.type);
}