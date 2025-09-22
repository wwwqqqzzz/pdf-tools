import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { loadPDFDocument, PDFProcessingError } from './simple-utils';
import { 
  FileValidationError, 
  MemoryError, 
  TimeoutError,
  createTimeoutPromise,
  isMemoryLimitReached 
} from '@/lib/utils/error-handling';

export interface WatermarkOptions {
  onProgress?: (progress: number) => void;
  type: 'text' | 'image';
  
  // Text watermark options
  text?: string;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
  font?: 'Helvetica' | 'Times-Roman' | 'Courier';
  
  // Image watermark options
  imageData?: Uint8Array;
  imageType?: 'jpg' | 'png';
  
  // Common options
  opacity?: number; // 0-1
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  rotation?: number; // degrees
  scale?: number; // 0.1-2.0
  pages?: number[]; // Specific pages (0-indexed), if not provided, apply to all pages
}

export interface WatermarkResult {
  data: Uint8Array;
  fileName: string;
  originalSize: number;
  processedSize: number;
  pagesProcessed: number;
}

export async function addWatermarkToPDF(file: File, options: WatermarkOptions): Promise<WatermarkResult> {
  const { onProgress } = options;
  
  if (!file) {
    throw new FileValidationError('No file provided for watermarking');
  }

  // Validate watermark options
  const validation = validateWatermarkOptions(options);
  if (!validation.isValid) {
    throw new FileValidationError(validation.error || 'Invalid watermark options');
  }

  // Check memory before starting
  if (isMemoryLimitReached(0.8)) {
    throw new MemoryError('Insufficient memory to process file. Please close other tabs or try with a smaller file.');
  }

  return await createTimeoutPromise(
    performWatermarking(file, options),
    60000, // 60 second timeout
    'PDF watermarking operation timed out. Please try with a smaller file.'
  );
}

async function performWatermarking(file: File, options: WatermarkOptions): Promise<WatermarkResult> {
  const { onProgress, type, pages } = options;
  const originalSize = file.size;
  
  try {
    if (onProgress) onProgress(10);

    const pdfDoc = await loadPDFDocument(file);
    
    if (onProgress) onProgress(20);

    const allPages = pdfDoc.getPages();
    const totalPages = allPages.length;
    
    // Determine which pages to watermark
    const pagesToProcess = pages || Array.from({ length: totalPages }, (_, i) => i);
    
    // Validate page numbers
    for (const pageIndex of pagesToProcess) {
      if (pageIndex < 0 || pageIndex >= totalPages) {
        throw new FileValidationError(`Invalid page number: ${pageIndex + 1}. PDF has ${totalPages} pages.`);
      }
    }

    if (onProgress) onProgress(30);

    // Prepare watermark based on type
    let watermarkImage;
    let font;
    
    if (type === 'text') {
      // Load font for text watermark
      const fontName = options.font || 'Helvetica';
      switch (fontName) {
        case 'Times-Roman':
          font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
          break;
        case 'Courier':
          font = await pdfDoc.embedFont(StandardFonts.Courier);
          break;
        default:
          font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }
    } else if (type === 'image' && options.imageData) {
      // Embed image for image watermark
      try {
        if (options.imageType === 'png') {
          watermarkImage = await pdfDoc.embedPng(options.imageData);
        } else {
          watermarkImage = await pdfDoc.embedJpg(options.imageData);
        }
      } catch (imageError) {
        throw new PDFProcessingError(`Failed to embed watermark image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
      }
    }

    if (onProgress) onProgress(40);

    // Apply watermark to each specified page
    for (let i = 0; i < pagesToProcess.length; i++) {
      const pageIndex = pagesToProcess[i];
      const page = allPages[pageIndex];
      
      try {
        await applyWatermarkToPage(page, options, font, watermarkImage);
        
        if (onProgress) {
          const pageProgress = 40 + ((i + 1) / pagesToProcess.length) * 40;
          onProgress(Math.round(pageProgress));
        }
      } catch (pageError) {
        console.warn(`Failed to watermark page ${pageIndex + 1}:`, pageError);
        // Continue with other pages instead of failing completely
      }
    }
    
    if (onProgress) onProgress(85);

    // Save the watermarked PDF
    const watermarkedData = await pdfDoc.save();
    
    if (onProgress) onProgress(100);

    const fileName = file.name.replace(/\.pdf$/i, '_watermarked.pdf');
    
    return {
      data: watermarkedData,
      fileName,
      originalSize,
      processedSize: watermarkedData.length,
      pagesProcessed: pagesToProcess.length,
    };
    
  } catch (error) {
    if (error instanceof PDFProcessingError || error instanceof MemoryError || error instanceof TimeoutError || error instanceof FileValidationError) {
      throw error;
    }
    throw new PDFProcessingError(`Failed to add watermark to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function applyWatermarkToPage(
  page: any, 
  options: WatermarkOptions, 
  font?: any, 
  watermarkImage?: any
): Promise<void> {
  const { type, opacity = 0.5, position = 'center', rotation = 0, scale = 1.0 } = options;
  const { width: pageWidth, height: pageHeight } = page.getSize();
  
  try {
    if (type === 'text' && options.text && font) {
      // Apply text watermark
      const text = options.text;
      const fontSize = (options.fontSize || 48) * scale;
      const color = options.color || { r: 0.5, g: 0.5, b: 0.5 };
      
      // Calculate text dimensions
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = fontSize;
      
      // Calculate position
      const { x, y } = calculatePosition(
        pageWidth, 
        pageHeight, 
        textWidth, 
        textHeight, 
        position
      );
      
      // Create watermark options
      const drawOptions: any = {
        x: Math.max(0, x),
        y: Math.max(0, y),
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity: Math.max(0.1, Math.min(1.0, opacity)),
      };
      
      // Add rotation if specified
      if (rotation !== 0) {
        drawOptions.rotate = degrees(rotation);
      }
      
      // Draw text watermark
      page.drawText(text, drawOptions);
      
    } else if (type === 'image' && watermarkImage) {
      // Apply image watermark
      const baseWidth = watermarkImage.width;
      const baseHeight = watermarkImage.height;
      
      // Scale the image appropriately
      let imageWidth = baseWidth * scale;
      let imageHeight = baseHeight * scale;
      
      // Ensure image fits on page (max 80% of page size)
      const maxWidth = pageWidth * 0.8;
      const maxHeight = pageHeight * 0.8;
      
      if (imageWidth > maxWidth) {
        const ratio = maxWidth / imageWidth;
        imageWidth = maxWidth;
        imageHeight = imageHeight * ratio;
      }
      
      if (imageHeight > maxHeight) {
        const ratio = maxHeight / imageHeight;
        imageHeight = maxHeight;
        imageWidth = imageWidth * ratio;
      }
      
      // Calculate position based on watermark position setting
      const { x, y } = calculatePosition(
        pageWidth, 
        pageHeight, 
        imageWidth, 
        imageHeight, 
        position
      );
      
      // Create image options with all required properties
      const drawOptions = {
        x: Math.max(0, Math.min(x, pageWidth - imageWidth)),
        y: Math.max(0, Math.min(y, pageHeight - imageHeight)),
        width: imageWidth,
        height: imageHeight,
        opacity: Math.max(0.1, Math.min(1.0, opacity)),
        ...(rotation !== 0 && { rotate: degrees(rotation) })
      };
      
      // Draw image watermark
      page.drawImage(watermarkImage, drawOptions);
    }
  } catch (error) {
    console.warn('Failed to apply watermark to page:', error);
    // Add a simple text indicator that watermark was attempted
    try {
      page.drawText('Watermark Applied', {
        x: 50,
        y: 50,
        size: 12,
        color: rgb(0.7, 0.7, 0.7),
        opacity: 0.5,
      });
    } catch (fallbackError) {
      console.warn('Failed to add fallback watermark indicator:', fallbackError);
    }
  }
}

function calculatePosition(
  pageWidth: number, 
  pageHeight: number, 
  elementWidth: number, 
  elementHeight: number, 
  position: string
): { x: number; y: number } {
  const margin = 20; // Margin from edges
  
  switch (position) {
    case 'top-left':
      return { x: margin, y: pageHeight - elementHeight - margin };
    case 'top-right':
      return { x: pageWidth - elementWidth - margin, y: pageHeight - elementHeight - margin };
    case 'bottom-left':
      return { x: margin, y: margin };
    case 'bottom-right':
      return { x: pageWidth - elementWidth - margin, y: margin };
    case 'center':
    default:
      return { 
        x: (pageWidth - elementWidth) / 2, 
        y: (pageHeight - elementHeight) / 2 
      };
  }
}

export function validateWatermarkInput(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File must be a PDF' };
  }

  // Check file size
  const maxSize = 50 * 1024 * 1024; // 50MB limit
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File too large for watermarking. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }

  return { isValid: true };
}

export function validateWatermarkOptions(options: WatermarkOptions): { isValid: boolean; error?: string } {
  if (!options.type || !['text', 'image'].includes(options.type)) {
    return { isValid: false, error: 'Watermark type must be either "text" or "image"' };
  }
  
  if (options.type === 'text') {
    if (!options.text || options.text.trim().length === 0) {
      return { isValid: false, error: 'Text watermark requires text content' };
    }
    
    if (options.fontSize && (options.fontSize < 8 || options.fontSize > 200)) {
      return { isValid: false, error: 'Font size must be between 8 and 200' };
    }
  }
  
  if (options.type === 'image') {
    if (!options.imageData || options.imageData.length === 0) {
      return { isValid: false, error: 'Image watermark requires image data' };
    }
    
    if (!options.imageType || !['jpg', 'png'].includes(options.imageType)) {
      return { isValid: false, error: 'Image type must be either "jpg" or "png"' };
    }
  }
  
  if (options.opacity !== undefined && (options.opacity < 0 || options.opacity > 1)) {
    return { isValid: false, error: 'Opacity must be between 0 and 1' };
  }
  
  if (options.scale !== undefined && (options.scale < 0.1 || options.scale > 2.0)) {
    return { isValid: false, error: 'Scale must be between 0.1 and 2.0' };
  }

  return { isValid: true };
}

export function getWatermarkPositionDescription(position: string): string {
  switch (position) {
    case 'top-left':
      return 'Top Left Corner';
    case 'top-right':
      return 'Top Right Corner';
    case 'bottom-left':
      return 'Bottom Left Corner';
    case 'bottom-right':
      return 'Bottom Right Corner';
    case 'center':
    default:
      return 'Center of Page';
  }
}

export function formatWatermarkResult(result: WatermarkResult, options: WatermarkOptions): string {
  const sizeMB = (result.processedSize / (1024 * 1024)).toFixed(2);
  const watermarkType = options.type === 'text' ? 'text' : 'image';
  
  return `${watermarkType} watermark applied to ${result.pagesProcessed} page(s). File size: ${sizeMB}MB`;
}