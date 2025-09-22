// PDF Processing Web Worker
import { PDFDocument, degrees } from 'pdf-lib';

export interface WorkerMessage {
  id: string;
  type: 'merge' | 'split' | 'compress' | 'convert' | 'rotate' | 'watermark';
  payload: any;
}

export interface WorkerResponse {
  id: string;
  type: 'success' | 'error' | 'progress';
  payload: any;
}

// Worker message handler
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data;
  
  try {
    let result: any;
    
    switch (type) {
      case 'merge':
        result = await handleMergePDFs(payload, id);
        break;
      case 'split':
        result = await handleSplitPDF(payload, id);
        break;
      case 'compress':
        result = await handleCompressPDF(payload, id);
        break;
      case 'rotate':
        result = await handleRotatePDF(payload, id);
        break;
      case 'watermark':
        result = await handleAddWatermark(payload, id);
        break;
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
    
    // Send success response
    const response: WorkerResponse = {
      id,
      type: 'success',
      payload: result,
    };
    
    self.postMessage(response);
    
  } catch (error) {
    // Send error response
    const response: WorkerResponse = {
      id,
      type: 'error',
      payload: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined,
      },
    };
    
    self.postMessage(response);
  }
};

async function handleMergePDFs(payload: { files: ArrayBuffer[] }, requestId: string): Promise<Uint8Array> {
  const { files } = payload;
  
  if (files.length === 0) {
    throw new Error('No files provided for merging');
  }
  
  const mergedPdf = await PDFDocument.create();
  let totalPages = 0;
  let processedPages = 0;
  
  // First pass: count total pages
  const pdfDocs = await Promise.all(
    files.map(async (fileBuffer) => {
      const doc = await PDFDocument.load(fileBuffer);
      totalPages += doc.getPageCount();
      return doc;
    })
  );
  
  // Second pass: merge pages
  for (const pdfDoc of pdfDocs) {
    const pageIndices = Array.from({ length: pdfDoc.getPageCount() }, (_, index) => index);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
    
    copiedPages.forEach(page => {
      mergedPdf.addPage(page);
      processedPages++;
      
      // Send progress update
      const progress = Math.round((processedPages / totalPages) * 100);
      const progressResponse: WorkerResponse = {
        id: requestId,
        type: 'progress',
        payload: { progress },
      };
      self.postMessage(progressResponse);
    });
  }
  
  return await mergedPdf.save();
}

async function handleSplitPDF(
  payload: { 
    file: ArrayBuffer; 
    splitType: 'pages' | 'size' | 'extract';
    options: any;
  },
  requestId: string
): Promise<Uint8Array[]> {
  const { file, splitType, options } = payload;
  const pdfDoc = await PDFDocument.load(file);
  const totalPages = pdfDoc.getPageCount();
  const results: Uint8Array[] = [];
  
  if (splitType === 'extract' && options.pageNumbers) {
    // Extract specific pages
    const pageNumbers = options.pageNumbers as number[];
    
    for (let i = 0; i < pageNumbers.length; i++) {
      const pageNum = pageNumbers[i];
      if (pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Invalid page number: ${pageNum}`);
      }
      
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
      newPdf.addPage(copiedPage);
      
      const pdfBytes = await newPdf.save();
      results.push(pdfBytes);
      
      // Send progress update
      const progress = Math.round(((i + 1) / pageNumbers.length) * 100);
      const progressResponse: WorkerResponse = {
        id: requestId,
        type: 'progress',
        payload: { progress },
      };
      self.postMessage(progressResponse);
    }
  } else if (splitType === 'pages' && options.pagesPerFile) {
    // Split by pages per file
    const pagesPerFile = options.pagesPerFile as number;
    const numFiles = Math.ceil(totalPages / pagesPerFile);
    
    for (let i = 0; i < numFiles; i++) {
      const startPage = i * pagesPerFile;
      const endPage = Math.min(startPage + pagesPerFile, totalPages);
      
      const newPdf = await PDFDocument.create();
      const pageIndices = Array.from(
        { length: endPage - startPage },
        (_, index) => startPage + index
      );
      
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      results.push(pdfBytes);
      
      // Send progress update
      const progress = Math.round(((i + 1) / numFiles) * 100);
      const progressResponse: WorkerResponse = {
        id: requestId,
        type: 'progress',
        payload: { progress },
      };
      self.postMessage(progressResponse);
    }
  }
  
  return results;
}

async function handleCompressPDF(
  payload: { file: ArrayBuffer; quality: 'low' | 'medium' | 'high' },
  requestId: string
): Promise<Uint8Array> {
  const { file, quality } = payload;
  const pdfDoc = await PDFDocument.load(file);
  
  // Send progress update
  const progressResponse: WorkerResponse = {
    id: requestId,
    type: 'progress',
    payload: { progress: 50 },
  };
  self.postMessage(progressResponse);
  
  // Simplified compression - in a real implementation, you would:
  // 1. Compress images within the PDF
  // 2. Remove unnecessary metadata
  // 3. Optimize fonts and other resources
  
  const compressionOptions = {
    useObjectStreams: true,
    addDefaultPage: false,
  };
  
  const compressedBytes = await pdfDoc.save(compressionOptions);
  
  return compressedBytes;
}

async function handleRotatePDF(
  payload: { file: ArrayBuffer; rotation: 90 | 180 | 270; pages?: number[] },
  requestId: string
): Promise<Uint8Array> {
  const { file, rotation, pages } = payload;
  const pdfDoc = await PDFDocument.load(file);
  const allPages = pdfDoc.getPages();
  
  const pagesToRotate = pages || Array.from({ length: allPages.length }, (_, i) => i);
  
  for (let i = 0; i < pagesToRotate.length; i++) {
    const pageIndex = pagesToRotate[i];
    if (pageIndex >= 0 && pageIndex < allPages.length) {
      const page = allPages[pageIndex];
      page.setRotation(degrees(rotation));
    }
    
    // Send progress update
    const progress = Math.round(((i + 1) / pagesToRotate.length) * 100);
    const progressResponse: WorkerResponse = {
      id: requestId,
      type: 'progress',
      payload: { progress },
    };
    self.postMessage(progressResponse);
  }
  
  return await pdfDoc.save();
}

async function handleAddWatermark(
  payload: {
    file: ArrayBuffer;
    text: string;
    position: 'center' | 'corner';
    opacity: number;
  },
  requestId: string
): Promise<Uint8Array> {
  const { file, text, position, opacity } = payload;
  const pdfDoc = await PDFDocument.load(file);
  const pages = pdfDoc.getPages();
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    
    let x: number, y: number;
    
    if (position === 'center') {
      x = width / 2;
      y = height / 2;
    } else {
      x = width - 100;
      y = height - 50;
    }
    
    page.drawText(text, {
      x,
      y,
      size: 50,
      opacity,
    });
    
    // Send progress update
    const progress = Math.round(((i + 1) / pages.length) * 100);
    const progressResponse: WorkerResponse = {
      id: requestId,
      type: 'progress',
      payload: { progress },
    };
    self.postMessage(progressResponse);
  }
  
  return await pdfDoc.save();
}

export {};