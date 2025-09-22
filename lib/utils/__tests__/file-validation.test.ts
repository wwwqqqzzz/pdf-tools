import {
  validateFileType,
  validateFileSize,
  validateFileCount,
  validateFile,
  validateFiles,
  formatFileSize,
  getFileExtension,
  isValidPDF,
  isValidImage,
  isValidDocument,
} from '../file-validation';

// Mock file creation helper
const createMockFile = (
  name: string,
  size: number = 1024,
  type: string = 'application/pdf'
): File => {
  return new File(['mock content'], name, { type, lastModified: Date.now() });
};

describe('File Validation Utilities', () => {
  describe('validateFileType', () => {
    it('should validate correct file types', () => {
      const file = createMockFile('test.pdf', 1024, 'application/pdf');
      const result = validateFileType(file, ['application/pdf']);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject incorrect file types', () => {
      const file = createMockFile('test.txt', 1024, 'text/plain');
      const result = validateFileType(file, ['application/pdf']);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File type text/plain is not supported');
    });

    it('should handle multiple allowed types', () => {
      const pdfFile = createMockFile('test.pdf', 1024, 'application/pdf');
      const imageFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const allowedTypes = ['application/pdf', 'image/jpeg'];
      
      expect(validateFileType(pdfFile, allowedTypes).isValid).toBe(true);
      expect(validateFileType(imageFile, allowedTypes).isValid).toBe(true);
    });
  });

  describe('validateFileSize', () => {
    it('should validate files within size limit', () => {
      const file = createMockFile('test.pdf', 5 * 1024 * 1024); // 5MB
      const result = validateFileSize(file, 10 * 1024 * 1024); // 10MB limit
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject files exceeding size limit', () => {
      const file = createMockFile('large.pdf', 15 * 1024 * 1024); // 15MB
      const result = validateFileSize(file, 10 * 1024 * 1024); // 10MB limit
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size 15MB exceeds maximum allowed size of 10MB');
    });

    it('should use default size limit when not specified', () => {
      const file = createMockFile('large.pdf', 15 * 1024 * 1024); // 15MB
      const result = validateFileSize(file); // Uses default 10MB limit
      
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateFileCount', () => {
    it('should validate correct file count', () => {
      const files = [
        createMockFile('test1.pdf'),
        createMockFile('test2.pdf'),
      ];
      const result = validateFileCount(files, 5);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject too many files', () => {
      const files = Array.from({ length: 15 }, (_, i) => 
        createMockFile(`test${i}.pdf`)
      );
      const result = validateFileCount(files, 10);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Too many files. Maximum allowed: 10, provided: 15');
    });
  });

  describe('validateFile', () => {
    it('should validate a correct file', () => {
      const file = createMockFile('test.pdf', 5 * 1024 * 1024, 'application/pdf');
      const result = validateFile(file, ['application/pdf'], 10 * 1024 * 1024);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject file with wrong type', () => {
      const file = createMockFile('test.txt', 1024, 'text/plain');
      const result = validateFile(file, ['application/pdf']);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File type text/plain is not supported');
    });

    it('should reject file that is too large', () => {
      const file = createMockFile('large.pdf', 15 * 1024 * 1024, 'application/pdf');
      const result = validateFile(file, ['application/pdf'], 10 * 1024 * 1024);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size 15MB exceeds maximum allowed size of 10MB');
    });
  });

  describe('validateFiles', () => {
    it('should validate multiple correct files', () => {
      const files = [
        createMockFile('test1.pdf', 5 * 1024 * 1024, 'application/pdf'),
        createMockFile('test2.pdf', 3 * 1024 * 1024, 'application/pdf'),
      ];
      const result = validateFiles(files, ['application/pdf'], 5, 10 * 1024 * 1024);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject when too many files', () => {
      const files = Array.from({ length: 15 }, (_, i) => 
        createMockFile(`test${i}.pdf`, 1024, 'application/pdf')
      );
      const result = validateFiles(files, ['application/pdf'], 10);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Too many files. Maximum allowed: 10, provided: 15');
    });

    it('should reject when any file is invalid', () => {
      const files = [
        createMockFile('test1.pdf', 5 * 1024 * 1024, 'application/pdf'),
        createMockFile('test2.txt', 1024, 'text/plain'), // Wrong type
      ];
      const result = validateFiles(files, ['application/pdf']);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File type text/plain is not supported');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB'); // 1.5 KB
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB'); // 1.5 MB
    });

    it('should handle large numbers', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 5.25)).toBe('5.25 GB');
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extensions correctly', () => {
      expect(getFileExtension('test.pdf')).toBe('pdf');
      expect(getFileExtension('document.docx')).toBe('docx');
      expect(getFileExtension('image.jpeg')).toBe('jpeg');
    });

    it('should handle files without extensions', () => {
      expect(getFileExtension('filename')).toBe('');
    });

    it('should handle multiple dots in filename', () => {
      expect(getFileExtension('my.document.pdf')).toBe('pdf');
    });

    it('should handle hidden files', () => {
      expect(getFileExtension('.gitignore')).toBe('gitignore');
    });
  });

  describe('isValidPDF', () => {
    it('should validate PDF files by MIME type', () => {
      const file = createMockFile('test.pdf', 1024, 'application/pdf');
      expect(isValidPDF(file)).toBe(true);
    });

    it('should validate PDF files by extension', () => {
      const file = createMockFile('test.pdf', 1024, ''); // No MIME type
      expect(isValidPDF(file)).toBe(true);
    });

    it('should reject non-PDF files', () => {
      const file = createMockFile('test.txt', 1024, 'text/plain');
      expect(isValidPDF(file)).toBe(false);
    });
  });

  describe('isValidImage', () => {
    it('should validate image files', () => {
      const jpegFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const pngFile = createMockFile('test.png', 1024, 'image/png');
      
      expect(isValidImage(jpegFile)).toBe(true);
      expect(isValidImage(pngFile)).toBe(true);
    });

    it('should reject non-image files', () => {
      const file = createMockFile('test.pdf', 1024, 'application/pdf');
      expect(isValidImage(file)).toBe(false);
    });
  });

  describe('isValidDocument', () => {
    it('should validate document files', () => {
      const docFile = createMockFile('test.doc', 1024, 'application/msword');
      const docxFile = createMockFile('test.docx', 1024, 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      
      expect(isValidDocument(docFile)).toBe(true);
      expect(isValidDocument(docxFile)).toBe(true);
    });

    it('should reject non-document files', () => {
      const file = createMockFile('test.pdf', 1024, 'application/pdf');
      expect(isValidDocument(file)).toBe(false);
    });
  });
});