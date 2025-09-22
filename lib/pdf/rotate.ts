import { PDFDocument, degrees } from 'pdf-lib';
import { loadPDFDocument, PDFProcessingError } from './simple-utils';
import { 
  FileValidationError, 
  MemoryError, 
  TimeoutError,
  createTimeoutPromise,
  isMemoryLimitReached 
} from '@/lib/utils/error-handling';

export interface RotateOptions {
  onProgress?: (progress: number) => void;
  rotation: 90 | 180 | 270; // Rotation angles in degrees
  pages?: number[]; // Specific pages to rotate (0-indexed), if not provided, rotate all pages
}

export interface RotateResult {
  data: Uint8Array;
  fileName: string;
  originalSize: number;
  processedSize: number;
  pagesRotated: number;
}

export async function rotatePDF(file: File, options: RotateOptions): Promise<RotateResult> {
  const { onProgress, rotation, pages } = options;
  
  if (!file) {
    throw new FileValidationError('No file provided for rotation');
  }

  // Validate rotation angle
  if (![90, 180, 270].includes(rotation)) {
    throw new FileValidationError('Invalid rotation angle. Must be 90, 180, or 270 degrees');
  }

  // Check memory before starting
  if (isMemoryLimitReached(0.8)) {
    throw new MemoryError('Insufficient memory to process file. Please close other tabs or try with a smaller file.');
  }

  return await createTimeoutPromise(
    performRotation(file, options),
    45000, // 45 second timeout
    'PDF rotation operation timed out. Please try with a smaller file.'
  );
}

async function performRotation(file: File, options: RotateOptions): Promise<RotateResult> {
  const { onProgress, rotation, pages } = options;
  const originalSize = file.size;
  
  try {
    if (onProgress) onProgress(10);

    const pdfDoc = await loadPDFDocument(file);
    
    if (onProgress) onProgress(30);

    const allPages = pdfDoc.getPages();
    const totalPages = allPages.length;
    
    // Determine which pages to rotate
    const pagesToRotate = pages || Array.from({ length: totalPages }, (_, i) => i);
    
    if (onProgress) onProgress(40);

    // Validate page numbers
    for (const pageIndex of pagesToRotate) {
      if (pageIndex < 0 || pageIndex >= totalPages) {
        throw new FileValidationError(`Invalid page number: ${pageIndex + 1}. PDF has ${totalPages} pages.`);
      }
    }

    // Rotate specified pages
    for (let i = 0; i < pagesToRotate.length; i++) {
      const pageIndex = pagesToRotate[i];
      const page = allPages[pageIndex];
      
      try {
        // Get current rotation and add new rotation
        const currentRotation = page.getRotation();
        const newRotation = (currentRotation.angle + rotation) % 360;
        
        // Set the new rotation
        page.setRotation(degrees(newRotation));
        
        if (onProgress) {
          const rotationProgress = 40 + ((i + 1) / pagesToRotate.length) * 40;
          onProgress(Math.round(rotationProgress));
        }
      } catch (pageError) {
        console.warn(`Failed to rotate page ${pageIndex + 1}:`, pageError);
        throw new PDFProcessingError(`Failed to rotate page ${pageIndex + 1}: ${pageError instanceof Error ? pageError.message : 'Unknown error'}`);
      }
    }
    
    if (onProgress) onProgress(80);

    // Save the rotated PDF
    const rotatedData = await pdfDoc.save();
    
    if (onProgress) onProgress(100);

    const fileName = file.name.replace(/\.pdf$/i, '_rotated.pdf');
    
    return {
      data: rotatedData,
      fileName,
      originalSize,
      processedSize: rotatedData.length,
      pagesRotated: pagesToRotate.length,
    };
    
  } catch (error) {
    if (error instanceof PDFProcessingError || error instanceof MemoryError || error instanceof TimeoutError || error instanceof FileValidationError) {
      throw error;
    }
    throw new PDFProcessingError(`Failed to rotate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateRotateInput(file: File, options: RotateOptions): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File must be a PDF' };
  }

  if (![90, 180, 270].includes(options.rotation)) {
    return { isValid: false, error: 'Invalid rotation angle. Must be 90, 180, or 270 degrees' };
  }

  // Check file size
  const maxSize = 50 * 1024 * 1024; // 50MB limit
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File too large for rotation. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }

  return { isValid: true };
}

export function getRotationDescription(rotation: 90 | 180 | 270): string {
  switch (rotation) {
    case 90:
      return 'Rotate 90° clockwise (portrait to landscape)';
    case 180:
      return 'Rotate 180° (upside down)';
    case 270:
      return 'Rotate 270° clockwise (landscape to portrait)';
    default:
      return 'Rotate pages';
  }
}

export function formatRotationResult(result: RotateResult, rotation: number): string {
  const sizeMB = (result.processedSize / (1024 * 1024)).toFixed(2);
  const rotationDesc = getRotationDescription(rotation as 90 | 180 | 270);
  
  return `${rotationDesc} applied to ${result.pagesRotated} page(s). File size: ${sizeMB}MB`;
}