import { PDFDocument } from 'pdf-lib';
import { loadPDFDocument, PDFProcessingError } from './simple-utils';
import { 
  FileValidationError, 
  MemoryError, 
  TimeoutError,
  createTimeoutPromise,
  isMemoryLimitReached,
  withErrorHandling 
} from '@/lib/utils/error-handling';

export interface MergeOptions {
  onProgress?: (progress: number) => void;
  preserveMetadata?: boolean;
}

export async function mergePDFs(files: File[], options: MergeOptions = {}): Promise<Uint8Array> {
  const { onProgress, preserveMetadata = true } = options;
  
  if (files.length === 0) {
    throw new FileValidationError('No files provided for merging');
  }
  
  if (files.length === 1) {
    // If only one file, just return it as-is
    return new Uint8Array(await files[0].arrayBuffer());
  }

  // Check memory before starting
  if (isMemoryLimitReached(0.8)) {
    throw new MemoryError('Insufficient memory to process files. Please close other tabs or try with smaller files.');
  }
  
  // Wrap the entire operation with timeout
  return await createTimeoutPromise(
    performMerge(files, options),
    30000, // 30 second timeout
    'PDF merge operation timed out. Please try with smaller files.'
  );
}

async function performMerge(files: File[], options: MergeOptions): Promise<Uint8Array> {
  const { onProgress, preserveMetadata = true } = options;
  
  try {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    
    // Set metadata if preserving from first document
    if (preserveMetadata && files.length > 0) {
      try {
        const firstDoc = await loadPDFDocument(files[0]);
        const title = firstDoc.getTitle();
        const author = firstDoc.getAuthor();
        const subject = firstDoc.getSubject();
        
        if (title) mergedPdf.setTitle(title);
        if (author) mergedPdf.setAuthor(author);
        if (subject) mergedPdf.setSubject(subject);
        mergedPdf.setCreator('PDF Tools');
        mergedPdf.setProducer('PDF Tools');
      } catch (error) {
        console.warn('Could not preserve metadata:', error);
      }
    }
    
    let totalPages = 0;
    let processedPages = 0;
    
    // First pass: count total pages for progress tracking
    for (const file of files) {
      try {
        // Check memory before processing each file
        if (isMemoryLimitReached(0.85)) {
          throw new MemoryError(`Insufficient memory to process ${file.name}. Try with fewer or smaller files.`);
        }
        
        const pdfDoc = await loadPDFDocument(file);
        totalPages += pdfDoc.getPageCount();
      } catch (error) {
        if (error instanceof MemoryError) {
          throw error;
        }
        throw new PDFProcessingError(`Failed to load PDF: ${file.name}. The file may be corrupted or password protected.`);
      }
    }
    
    // Second pass: merge all pages
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Check memory before processing each file
        if (isMemoryLimitReached(0.9)) {
          throw new MemoryError(`Memory limit reached while processing ${file.name}. Try with fewer files.`);
        }
        
        const pdfDoc = await loadPDFDocument(file);
        const pageIndices = Array.from({ length: pdfDoc.getPageCount() }, (_, index) => index);
        
        // Copy pages from current document
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
        
        // Add each copied page to the merged document
        copiedPages.forEach(page => {
          mergedPdf.addPage(page);
          processedPages++;
          
          // Check memory after adding each page
          if (processedPages % 10 === 0 && isMemoryLimitReached(0.9)) {
            throw new MemoryError('Memory limit reached during merge. Try with fewer pages or smaller files.');
          }
          
          // Report progress
          if (onProgress) {
            const progress = Math.round((processedPages / totalPages) * 100);
            onProgress(progress);
          }
        });
        
      } catch (error) {
        if (error instanceof MemoryError) {
          throw error;
        }
        throw new PDFProcessingError(`Failed to merge PDF: ${file.name}. ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Save the merged PDF
    const pdfBytes = await mergedPdf.save();
    
    if (onProgress) {
      onProgress(100);
    }
    
    return pdfBytes;
    
  } catch (error) {
    if (error instanceof PDFProcessingError || error instanceof MemoryError || error instanceof TimeoutError) {
      throw error;
    }
    throw new PDFProcessingError(`Failed to merge PDFs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function mergePDFsWithCustomOrder(
  files: File[],
  order: number[],
  options: MergeOptions = {}
): Promise<Uint8Array> {
  if (order.length !== files.length) {
    throw new PDFProcessingError('Order array length must match files array length');
  }
  
  // Reorder files according to the specified order
  const reorderedFiles = order.map(index => {
    if (index < 0 || index >= files.length) {
      throw new PDFProcessingError(`Invalid order index: ${index}`);
    }
    return files[index];
  });
  
  return mergePDFs(reorderedFiles, options);
}

export function validateMergeInput(files: File[]): { isValid: boolean; error?: string } {
  if (!files || files.length === 0) {
    return { isValid: false, error: 'No files provided' };
  }
  
  if (files.length > 50) {
    return { isValid: false, error: 'Too many files. Maximum 50 files allowed for merging.' };
  }
  
  // Check if all files are PDFs
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { isValid: false, error: `File ${file.name} is not a valid PDF` };
    }
  }
  
  return { isValid: true };
}