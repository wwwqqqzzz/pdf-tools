import { PDFDocument } from 'pdf-lib';
import { loadPDFDocument, PDFProcessingError } from './simple-utils';
import { 
  FileValidationError, 
  MemoryError, 
  TimeoutError,
  createTimeoutPromise,
  isMemoryLimitReached 
} from '@/lib/utils/error-handling';

export interface SplitOptions {
  onProgress?: (progress: number) => void;
  splitType: 'pages' | 'range' | 'extract';
  pageRanges?: { start: number; end: number }[];
  specificPages?: number[];
  pagesPerFile?: number;
}

export interface SplitResult {
  files: Uint8Array[];
  names: string[];
}

export async function splitPDF(file: File, options: SplitOptions): Promise<SplitResult> {
  const { onProgress, splitType, pageRanges, specificPages, pagesPerFile } = options;
  
  if (!file) {
    throw new FileValidationError('No file provided for splitting');
  }

  // Check memory before starting
  if (isMemoryLimitReached(0.8)) {
    throw new MemoryError('Insufficient memory to process file. Please close other tabs or try with a smaller file.');
  }

  // Wrap the entire operation with timeout
  return await createTimeoutPromise(
    performSplit(file, options),
    30000, // 30 second timeout
    'PDF split operation timed out. Please try with a smaller file.'
  );
}

async function performSplit(file: File, options: SplitOptions): Promise<SplitResult> {
  const { onProgress, splitType, pageRanges, specificPages, pagesPerFile } = options;
  
  try {
    const pdfDoc = await loadPDFDocument(file);
    const totalPages = pdfDoc.getPageCount();
    const results: Uint8Array[] = [];
    const names: string[] = [];
    
    let processedFiles = 0;
    let totalFilesToCreate = 0;

    // Calculate total files to create for progress tracking
    switch (splitType) {
      case 'pages':
        totalFilesToCreate = Math.ceil(totalPages / (pagesPerFile || 1));
        break;
      case 'range':
        totalFilesToCreate = pageRanges?.length || 0;
        break;
      case 'extract':
        totalFilesToCreate = specificPages?.length || 0;
        break;
    }

    if (splitType === 'pages' && pagesPerFile) {
      // Split by pages per file
      for (let i = 0; i < totalPages; i += pagesPerFile) {
        // Check memory before processing each chunk
        if (isMemoryLimitReached(0.9)) {
          throw new MemoryError('Memory limit reached during split. Try with fewer pages.');
        }

        const endPage = Math.min(i + pagesPerFile, totalPages);
        const pageIndices = Array.from({ length: endPage - i }, (_, index) => i + index);
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        results.push(pdfBytes);
        names.push(`${file.name.replace('.pdf', '')}_pages_${i + 1}-${endPage}.pdf`);
        
        processedFiles++;
        if (onProgress) {
          const progress = Math.round((processedFiles / totalFilesToCreate) * 100);
          onProgress(progress);
        }
      }
    } else if (splitType === 'range' && pageRanges) {
      // Split by page ranges
      for (let i = 0; i < pageRanges.length; i++) {
        const range = pageRanges[i];
        
        if (range.start < 1 || range.end > totalPages || range.start > range.end) {
          throw new PDFProcessingError(`Invalid page range: ${range.start}-${range.end}. Document has ${totalPages} pages.`);
        }

        // Check memory
        if (isMemoryLimitReached(0.9)) {
          throw new MemoryError('Memory limit reached during split.');
        }

        const pageIndices = Array.from(
          { length: range.end - range.start + 1 }, 
          (_, index) => range.start - 1 + index
        );
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        results.push(pdfBytes);
        names.push(`${file.name.replace('.pdf', '')}_pages_${range.start}-${range.end}.pdf`);
        
        processedFiles++;
        if (onProgress) {
          const progress = Math.round((processedFiles / totalFilesToCreate) * 100);
          onProgress(progress);
        }
      }
    } else if (splitType === 'extract' && specificPages) {
      // Extract specific pages
      for (let i = 0; i < specificPages.length; i++) {
        const pageNum = specificPages[i];
        
        if (pageNum < 1 || pageNum > totalPages) {
          throw new PDFProcessingError(`Invalid page number: ${pageNum}. Document has ${totalPages} pages.`);
        }

        // Check memory
        if (isMemoryLimitReached(0.9)) {
          throw new MemoryError('Memory limit reached during extraction.');
        }

        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
        newPdf.addPage(copiedPage);
        
        const pdfBytes = await newPdf.save();
        results.push(pdfBytes);
        names.push(`${file.name.replace('.pdf', '')}_page_${pageNum}.pdf`);
        
        processedFiles++;
        if (onProgress) {
          const progress = Math.round((processedFiles / totalFilesToCreate) * 100);
          onProgress(progress);
        }
      }
    }

    if (onProgress) {
      onProgress(100);
    }

    return { files: results, names };
    
  } catch (error) {
    if (error instanceof PDFProcessingError || error instanceof MemoryError || error instanceof TimeoutError) {
      throw error;
    }
    throw new PDFProcessingError(`Failed to split PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateSplitInput(file: File, options: SplitOptions): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File must be a PDF' };
  }

  const { splitType, pageRanges, specificPages, pagesPerFile } = options;

  if (splitType === 'pages' && (!pagesPerFile || pagesPerFile < 1)) {
    return { isValid: false, error: 'Pages per file must be at least 1' };
  }

  if (splitType === 'range' && (!pageRanges || pageRanges.length === 0)) {
    return { isValid: false, error: 'Page ranges must be specified' };
  }

  if (splitType === 'extract' && (!specificPages || specificPages.length === 0)) {
    return { isValid: false, error: 'Specific pages must be specified' };
  }

  return { isValid: true };
}