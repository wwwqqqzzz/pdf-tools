import { mergePDFs, validateMergeInput, mergePDFsWithCustomOrder } from '../merge';
import { FileValidationError, MemoryError } from '@/lib/utils/error-handling';

// Mock files for testing
const createMockFile = (name: string, size: number = 1024, type: string = 'application/pdf'): File => {
  return new File(['mock content'], name, { type, lastModified: Date.now() });
};

describe('PDF Merge Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateMergeInput', () => {
    it('should validate correct input', () => {
      const files = [
        createMockFile('test1.pdf'),
        createMockFile('test2.pdf'),
      ];
      
      const result = validateMergeInput(files);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty file array', () => {
      const result = validateMergeInput([]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('No files provided');
    });

    it('should reject too many files', () => {
      const files = Array.from({ length: 51 }, (_, i) => createMockFile(`test${i}.pdf`));
      const result = validateMergeInput(files);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Too many files. Maximum 50 files allowed for merging.');
    });

    it('should reject non-PDF files', () => {
      const files = [
        createMockFile('test1.pdf'),
        createMockFile('test2.txt', 1024, 'text/plain'),
      ];
      
      const result = validateMergeInput(files);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File test2.txt is not a valid PDF');
    });
  });

  describe('mergePDFs', () => {
    it('should merge multiple PDF files successfully', async () => {
      const files = [
        createMockFile('test1.pdf'),
        createMockFile('test2.pdf'),
      ];

      const progressCallback = jest.fn();
      const result = await mergePDFs(files, { onProgress: progressCallback });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
      expect(progressCallback).toHaveBeenCalledWith(100);
    });

    it('should return single file as-is when only one file provided', async () => {
      const file = createMockFile('test.pdf');
      const result = await mergePDFs([file]);

      expect(result).toBeInstanceOf(Uint8Array);
    });

    it('should throw error when no files provided', async () => {
      await expect(mergePDFs([])).rejects.toThrow(FileValidationError);
    });

    it('should call progress callback during merge', async () => {
      const files = [
        createMockFile('test1.pdf'),
        createMockFile('test2.pdf'),
        createMockFile('test3.pdf'),
      ];

      const progressCallback = jest.fn();
      await mergePDFs(files, { onProgress: progressCallback });

      expect(progressCallback).toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith(100);
    });

    it('should preserve metadata when option is enabled', async () => {
      const files = [
        createMockFile('test1.pdf'),
        createMockFile('test2.pdf'),
      ];

      const result = await mergePDFs(files, { preserveMetadata: true });
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it('should handle memory limit errors', async () => {
      // Mock memory limit reached
      const originalMemory = (global.performance as any).memory;
      (global.performance as any).memory = {
        usedJSHeapSize: 95 * 1024 * 1024, // 95MB used
        jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB limit
      };

      const files = [createMockFile('large.pdf', 50 * 1024 * 1024)]; // 50MB file

      await expect(mergePDFs(files)).rejects.toThrow(MemoryError);

      // Restore original memory
      (global.performance as any).memory = originalMemory;
    });
  });

  describe('mergePDFsWithCustomOrder', () => {
    it('should merge files in custom order', async () => {
      const files = [
        createMockFile('first.pdf'),
        createMockFile('second.pdf'),
        createMockFile('third.pdf'),
      ];

      const customOrder = [2, 0, 1]; // third, first, second
      const result = await mergePDFsWithCustomOrder(files, customOrder);

      expect(result).toBeInstanceOf(Uint8Array);
    });

    it('should throw error for invalid order array length', async () => {
      const files = [createMockFile('test1.pdf'), createMockFile('test2.pdf')];
      const invalidOrder = [0]; // Wrong length

      await expect(mergePDFsWithCustomOrder(files, invalidOrder))
        .rejects.toThrow('Order array length must match files array length');
    });

    it('should throw error for invalid order index', async () => {
      const files = [createMockFile('test1.pdf'), createMockFile('test2.pdf')];
      const invalidOrder = [0, 5]; // Index 5 doesn't exist

      await expect(mergePDFsWithCustomOrder(files, invalidOrder))
        .rejects.toThrow('Invalid order index: 5');
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted PDF files gracefully', async () => {
      // Mock pdf-lib to throw an error for corrupted files
      const { PDFDocument } = require('pdf-lib');
      PDFDocument.load.mockRejectedValueOnce(new Error('Invalid PDF'));

      const files = [createMockFile('corrupted.pdf')];

      await expect(mergePDFs(files)).rejects.toThrow('Failed to load PDF: corrupted.pdf');
    });

    it('should timeout for long-running operations', async () => {
      // Mock a long-running operation
      const { PDFDocument } = require('pdf-lib');
      PDFDocument.create.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 35000)) // 35 seconds
      );

      const files = [createMockFile('slow.pdf')];

      await expect(mergePDFs(files)).rejects.toThrow('PDF merge operation timed out');
    }, 35000);
  });

  describe('Performance', () => {
    it('should handle multiple small files efficiently', async () => {
      const files = Array.from({ length: 10 }, (_, i) => 
        createMockFile(`test${i}.pdf`, 1024)
      );

      const startTime = Date.now();
      const result = await mergePDFs(files);
      const endTime = Date.now();

      expect(result).toBeInstanceOf(Uint8Array);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
    });

    it('should report progress accurately', async () => {
      const files = Array.from({ length: 5 }, (_, i) => 
        createMockFile(`test${i}.pdf`)
      );

      const progressValues: number[] = [];
      const progressCallback = (progress: number) => {
        progressValues.push(progress);
      };

      await mergePDFs(files, { onProgress: progressCallback });

      expect(progressValues.length).toBeGreaterThan(0);
      expect(progressValues[progressValues.length - 1]).toBe(100);
      
      // Progress should be non-decreasing
      for (let i = 1; i < progressValues.length; i++) {
        expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
      }
    });
  });
});