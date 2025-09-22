/**
 * @jest-environment jsdom
 */

import { validateMergeInput } from '../merge';

// Mock file creation helper
const createMockFile = (
  name: string,
  size: number = 1024,
  type: string = 'application/pdf'
): File => {
  return new File(['mock content'], name, { type, lastModified: Date.now() });
};

describe('Simple PDF Merge Tests', () => {
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
});