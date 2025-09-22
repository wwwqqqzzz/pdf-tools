import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
// Dynamic import to avoid SSR issues
let pdfjsLib: any = null;

// Initialize PDF.js only on client side
if (typeof window !== 'undefined') {
  import('pdfjs-dist').then((pdfjs) => {
    pdfjsLib = pdfjs;
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  });
}

export interface PDFInfo {
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export async function loadPDFDocument(file: File): Promise<PDFDocument> {
  const arrayBuffer = await file.arrayBuffer();
  return await PDFDocument.load(arrayBuffer);
}

export async function getPDFInfo(file: File): Promise<PDFInfo> {
  try {
    // Ensure PDF.js is loaded
    if (!pdfjsLib) {
      const pdfjs = await import('pdfjs-dist');
      pdfjsLib = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const metadata = await pdfDoc.getMetadata();
    
    return {
      pageCount: pdfDoc.numPages,
      title: metadata.info?.Title,
      author: metadata.info?.Author,
      subject: metadata.info?.Subject,
      creator: metadata.info?.Creator,
      producer: metadata.info?.Producer,
      creationDate: metadata.info?.CreationDate,
      modificationDate: metadata.info?.ModDate,
    };
  } catch (error) {
    console.error('Error getting PDF info:', error);
    throw new Error('Failed to read PDF information');
  }
}

export async function createPDFFromPages(pages: PDFPage[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  for (const page of pages) {
    const [copiedPage] = await pdfDoc.copyPages(page.doc, [page.doc.getPages().indexOf(page)]);
    pdfDoc.addPage(copiedPage);
  }
  
  return await pdfDoc.save();
}

export async function renderPDFPageAsImage(
  file: File,
  pageNumber: number,
  scale: number = 1.5
): Promise<string> {
  try {
    // Ensure PDF.js is loaded
    if (!pdfjsLib) {
      const pdfjs = await import('pdfjs-dist');
      pdfjsLib = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdfDoc.getPage(pageNumber);
    
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    throw new Error('Failed to render PDF page');
  }
}

export function createDownloadLink(data: Uint8Array, filename: string, mimeType: string = 'application/pdf'): string {
  const blob = new Blob([new Uint8Array(data)], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function cleanupObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}

export async function compressPDFImages(pdfDoc: PDFDocument, quality: number = 0.8): Promise<void> {
  // This is a simplified compression - in a real implementation,
  // you would need more sophisticated image compression
  const pages = pdfDoc.getPages();
  
  for (const page of pages) {
    // Get page resources and compress images
    // This is a placeholder for actual image compression logic
    console.log(`Compressing images on page with quality: ${quality}`);
  }
}

export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

export async function addTextWatermark(
  pdfDoc: PDFDocument,
  text: string,
  options: {
    opacity?: number;
    fontSize?: number;
    color?: [number, number, number];
    position?: 'center' | 'corner';
  } = {}
): Promise<void> {
  const {
    opacity = 0.5,
    fontSize = 50,
    color = [0.5, 0.5, 0.5],
    position = 'center',
  } = options;

  const pages = pdfDoc.getPages();
  
  for (const page of pages) {
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
      size: fontSize,
      color: rgb(color[0], color[1], color[2]),
      opacity,
    });
  }
}

export function validatePDFFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export class PDFProcessingError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PDFProcessingError';
  }
}