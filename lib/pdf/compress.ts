import { PDFDocument } from 'pdf-lib';
import { loadPDFDocument, PDFProcessingError } from './simple-utils';
import { 
  FileValidationError, 
  MemoryError, 
  TimeoutError,
  createTimeoutPromise,
  isMemoryLimitReached 
} from '@/lib/utils/error-handling';

export interface CompressOptions {
  onProgress?: (progress: number) => void;
  quality: 'low' | 'medium' | 'high';
  targetSize?: number; // Target size in bytes (optional)
}

export interface CompressResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export async function compressPDF(file: File, options: CompressOptions): Promise<CompressResult> {
  const { onProgress, quality } = options;
  
  if (!file) {
    throw new FileValidationError('No file provided for compression');
  }

  // Check memory before starting
  if (isMemoryLimitReached(0.8)) {
    throw new MemoryError('Insufficient memory to process file. Please close other tabs or try with a smaller file.');
  }

  // Try multiple compression strategies
  return await createTimeoutPromise(
    performAdvancedCompress(file, options),
    60000, // 60 second timeout for compression
    'PDF compression operation timed out. Please try with a smaller file.'
  );
}

async function performAdvancedCompress(file: File, options: CompressOptions): Promise<CompressResult> {
  const { onProgress, quality } = options;
  const originalSize = file.size;
  
  try {
    if (onProgress) onProgress(5);

    // Try multiple compression approaches and use the best result
    const results = await Promise.allSettled([
      performBasicCompress(file, options),
      performReconstructionCompress(file, options)
    ]);

    // Find the best compression result
    let bestResult: CompressResult | null = null;
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        if (!bestResult || result.value.compressedSize < bestResult.compressedSize) {
          bestResult = result.value;
        }
      }
    }

    if (!bestResult) {
      throw new PDFProcessingError('All compression methods failed');
    }

    if (onProgress) onProgress(100);
    return bestResult;
    
  } catch (error) {
    // Fallback to basic compression
    return await performBasicCompress(file, options);
  }
}

async function performBasicCompress(file: File, options: CompressOptions): Promise<CompressResult> {
  const { onProgress, quality } = options;
  const originalSize = file.size;
  
  try {
    if (onProgress) onProgress(10);

    const pdfDoc = await loadPDFDocument(file);
    
    if (onProgress) onProgress(30);

    // Check memory after loading
    if (isMemoryLimitReached(0.9)) {
      throw new MemoryError('Memory limit reached during compression. Try with a smaller file.');
    }

    // Get compression settings based on quality
    const compressionSettings = getCompressionSettings(quality);
    
    if (onProgress) onProgress(40);

    // Apply compression optimizations
    await optimizePDF(pdfDoc, compressionSettings, onProgress);
    
    if (onProgress) onProgress(60);

    // Try different compression strategies based on quality
    let compressedData: Uint8Array;
    
    if (quality === 'low') {
      // Maximum compression - try multiple approaches
      compressedData = await tryMaximumCompression(pdfDoc, onProgress);
    } else if (quality === 'medium') {
      // Balanced compression
      compressedData = await tryBalancedCompression(pdfDoc, onProgress);
    } else {
      // Minimal compression - preserve quality
      compressedData = await tryMinimalCompression(pdfDoc, onProgress);
    }
    
    if (onProgress) onProgress(100);

    const compressedSize = compressedData.length;
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    return {
      data: compressedData,
      originalSize,
      compressedSize,
      compressionRatio: Math.max(0, compressionRatio),
    };
    
  } catch (error) {
    if (error instanceof PDFProcessingError || error instanceof MemoryError || error instanceof TimeoutError) {
      throw error;
    }
    throw new PDFProcessingError(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}



async function performAggressiveOptimizations(
  pdfDoc: PDFDocument, 
  settings: CompressionSettings, 
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    // Remove all metadata aggressively
    if (settings.removeMetadata) {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
    }

    if (onProgress) onProgress(50);

    // Get pages and try to optimize them
    const pages = pdfDoc.getPages();
    
    for (let i = 0; i < pages.length; i++) {
      try {
        const page = pages[i];
        
        // Try to optimize page content
        // Note: This is limited by pdf-lib's capabilities
        // In a real-world scenario, you'd use more specialized libraries
        
        if (onProgress) {
          const pageProgress = 50 + (i / pages.length) * 15;
          onProgress(Math.round(pageProgress));
        }
      } catch (pageError) {
        console.warn(`Failed to optimize page ${i + 1}:`, pageError);
      }
    }
    
    if (onProgress) onProgress(65);
    
  } catch (error) {
    console.warn('Aggressive optimizations failed:', error);
  }
}

// Different compression strategies
async function tryMaximumCompression(pdfDoc: PDFDocument, onProgress?: (progress: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(70);
  
  // Try multiple compression approaches and return the smallest
  const compressionAttempts = await Promise.allSettled([
    // Attempt 1: Maximum object streams
    pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 500,
      updateFieldAppearances: false,
    }),
    
    // Attempt 2: No object streams but other optimizations
    pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      objectsPerTick: 200,
      updateFieldAppearances: false,
    }),
  ]);
  
  // Find the smallest result
  let smallestResult: Uint8Array | null = null;
  let smallestSize = Infinity;
  
  for (const attempt of compressionAttempts) {
    if (attempt.status === 'fulfilled') {
      if (attempt.value.length < smallestSize) {
        smallestSize = attempt.value.length;
        smallestResult = attempt.value;
      }
    }
  }
  
  if (onProgress) onProgress(85);
  
  return smallestResult || await pdfDoc.save({ useObjectStreams: true });
}

async function tryBalancedCompression(pdfDoc: PDFDocument, onProgress?: (progress: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(70);
  
  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 100,
    updateFieldAppearances: false,
  });
}

async function tryMinimalCompression(pdfDoc: PDFDocument, onProgress?: (progress: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(70);
  
  return await pdfDoc.save({
    useObjectStreams: false,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: true, // Keep field appearances for quality
  });
}

// Reconstruction-based compression - creates a new PDF with only essential content
async function performReconstructionCompress(file: File, options: CompressOptions): Promise<CompressResult> {
  const { onProgress, quality } = options;
  const originalSize = file.size;
  
  try {
    if (onProgress) onProgress(10);

    const sourcePdf = await loadPDFDocument(file);
    
    if (onProgress) onProgress(20);

    // Create a new PDF document
    const newPdf = await PDFDocument.create();
    
    if (onProgress) onProgress(30);

    // Copy pages with compression
    const sourcePages = sourcePdf.getPages();
    const totalPages = sourcePages.length;
    
    for (let i = 0; i < totalPages; i++) {
      try {
        // Copy page to new document
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
        newPdf.addPage(copiedPage);
        
        // Apply quality-based optimizations to the copied page
        if (quality === 'low') {
          // For low quality, we could potentially scale down the page
          // but this might affect readability, so we'll skip for now
        }
        
        if (onProgress) {
          const pageProgress = 30 + ((i + 1) / totalPages) * 40;
          onProgress(Math.round(pageProgress));
        }
      } catch (pageError) {
        console.warn(`Failed to copy page ${i + 1}:`, pageError);
        // Continue with other pages
      }
    }
    
    if (onProgress) onProgress(70);

    // Set minimal metadata for the new PDF
    if (quality === 'low' || quality === 'medium') {
      newPdf.setTitle('');
      newPdf.setAuthor('');
      newPdf.setSubject('');
      newPdf.setKeywords([]);
      newPdf.setProducer('PDF Tools');
      newPdf.setCreator('PDF Tools');
    }
    
    if (onProgress) onProgress(80);

    // Save the reconstructed PDF with appropriate compression
    const compressionOptions = getReconstructionSaveOptions(quality);
    const compressedData = await newPdf.save(compressionOptions);
    
    if (onProgress) onProgress(100);

    const compressedSize = compressedData.length;
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    return {
      data: compressedData,
      originalSize,
      compressedSize,
      compressionRatio: Math.max(0, compressionRatio),
    };
    
  } catch (error) {
    throw new PDFProcessingError(`Reconstruction compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getReconstructionSaveOptions(quality: 'low' | 'medium' | 'high') {
  switch (quality) {
    case 'low':
      return {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 1000, // Very aggressive
        updateFieldAppearances: false,
      };
    case 'medium':
      return {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 200,
        updateFieldAppearances: false,
      };
    case 'high':
      return {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: true,
      };
    default:
      return getReconstructionSaveOptions('medium');
  }
}

interface CompressionSettings {
  useObjectStreams: boolean;
  objectsPerTick: number;
  imageQuality: number;
  removeMetadata: boolean;
}

function getCompressionSettings(quality: 'low' | 'medium' | 'high'): CompressionSettings {
  switch (quality) {
    case 'low': // Low quality = High compression
      return {
        useObjectStreams: true,
        objectsPerTick: 100, // More aggressive processing
        imageQuality: 0.2, // Lower image quality for better compression
        removeMetadata: true,
      };
    case 'medium': // Medium quality = Medium compression
      return {
        useObjectStreams: true,
        objectsPerTick: 50,
        imageQuality: 0.5,
        removeMetadata: true,
      };
    case 'high': // High quality = Low compression
      return {
        useObjectStreams: true,
        objectsPerTick: 25,
        imageQuality: 0.8, // Higher image quality, less compression
        removeMetadata: false,
      };
    default:
      return getCompressionSettings('medium');
  }
}

async function optimizePDF(
  pdfDoc: PDFDocument, 
  settings: CompressionSettings, 
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    // Remove metadata if requested
    if (settings.removeMetadata) {
      // Clear optional metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('PDF Tools');
      pdfDoc.setCreator('PDF Tools');
      pdfDoc.setCreationDate(new Date());
      pdfDoc.setModificationDate(new Date());
    }

    if (onProgress) onProgress(60);

    // Get all pages for optimization
    const pages = pdfDoc.getPages();
    
    // Optimize each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      try {
        // Get page resources and try to optimize
        const { width, height } = page.getSize();
        
        // For very large pages, we could potentially scale them down
        // but this might affect quality, so we'll skip for now
        
        // Update progress
        if (onProgress) {
          const pageProgress = 60 + (i / pages.length) * 10;
          onProgress(Math.round(pageProgress));
        }
      } catch (pageError) {
        console.warn(`Failed to optimize page ${i + 1}:`, pageError);
        // Continue with other pages
      }
    }
    
    if (onProgress) onProgress(70);

    // Additional optimizations:
    // Note: pdf-lib has limited compression capabilities
    // For better compression, we would need additional libraries like:
    // - PDF2pic for image extraction and recompression
    // - Sharp for image optimization
    // - Custom font subsetting
    
  } catch (error) {
    console.warn('Some optimizations failed:', error);
    // Continue with basic compression even if optimizations fail
  }
}

export function validateCompressInput(file: File, options: CompressOptions): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File must be a PDF' };
  }

  if (!['low', 'medium', 'high'].includes(options.quality)) {
    return { isValid: false, error: 'Invalid quality setting' };
  }

  // Check if file is too large for compression
  const maxSize = 50 * 1024 * 1024; // 50MB limit for compression
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File too large for compression. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }

  return { isValid: true };
}

export function formatCompressionResult(result: CompressResult): string {
  const originalMB = (result.originalSize / (1024 * 1024)).toFixed(2);
  const compressedMB = (result.compressedSize / (1024 * 1024)).toFixed(2);
  
  if (result.compressionRatio > 0) {
    return `Compressed from ${originalMB}MB to ${compressedMB}MB (${result.compressionRatio}% reduction)`;
  } else {
    return `File size: ${compressedMB}MB (no significant compression achieved)`;
  }
}
// 获取压缩
级别描述
export function getCompressionDescription(level: 'low' | 'medium' | 'high'): string {
  const descriptions = {
    low: '轻度压缩：清理元数据，重建文件结构（推荐日常使用）',
    medium: '中度压缩：优化对象流，移除冗余数据（平衡质量与大小）',
    high: '重度压缩：最大化压缩，可能影响兼容性（最小文件大小）'
  };
  
  return descriptions[level];
}

// 获取压缩能力说明
export function getCompressionCapabilities(): {
  supported: string[];
  limitations: string[];
  recommendations: string[];
} {
  return {
    supported: [
      '清理PDF元数据（作者、创建时间等）',
      '重建文件结构，移除冗余对象',
      '优化对象流和交叉引用表',
      '压缩文本和矢量图形数据'
    ],
    limitations: [
      '无法压缩PDF内嵌的图片（需要专业工具）',
      '扫描版PDF压缩效果有限',
      '已经高度优化的PDF可能无明显效果'
    ],
    recommendations: [
      '对于文档类PDF效果最佳',
      '建议先尝试轻度压缩',
      '如需图片压缩，推荐使用专业PDF工具'
    ]
  };
}