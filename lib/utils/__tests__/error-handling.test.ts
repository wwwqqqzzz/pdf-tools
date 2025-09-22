import {
  PDFProcessingError,
  FileValidationError,
  MemoryError,
  TimeoutError,
  categorizeError,
  createUserFriendlyError,
  createTimeoutPromise,
  checkMemoryUsage,
  isMemoryLimitReached,
  createRetryWrapper,
} from '../error-handling';

describe('Error Handling Utilities', () => {
  describe('Error Classes', () => {
    it('should create PDFProcessingError with correct properties', () => {
      const error = new PDFProcessingError('Test error', 'TEST_CODE', { detail: 'test' });
      
      expect(error.name).toBe('PDFProcessingError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual({ detail: 'test' });
    });

    it('should create FileValidationError with correct properties', () => {
      const error = new FileValidationError('Invalid file', 'test.pdf', 1024);
      
      expect(error.name).toBe('FileValidationError');
      expect(error.message).toBe('Invalid file');
      expect(error.fileName).toBe('test.pdf');
      expect(error.fileSize).toBe(1024);
    });

    it('should create MemoryError with correct properties', () => {
      const error = new MemoryError('Out of memory', 1024 * 1024);
      
      expect(error.name).toBe('MemoryError');
      expect(error.message).toBe('Out of memory');
      expect(error.memoryUsage).toBe(1024 * 1024);
    });

    it('should create TimeoutError with correct properties', () => {
      const error = new TimeoutError('Operation timed out', 5000);
      
      expect(error.name).toBe('TimeoutError');
      expect(error.message).toBe('Operation timed out');
      expect(error.timeoutMs).toBe(5000);
    });
  });

  describe('categorizeError', () => {
    it('should categorize FileValidationError correctly', () => {
      const error = new FileValidationError('Invalid file');
      const result = categorizeError(error);
      
      expect(result.type).toBe('validation');
      expect(result.userMessage).toBe('There was an issue with your file.');
      expect(result.canRetry).toBe(true);
      expect(result.suggestions).toContain('Make sure your file is a valid PDF');
    });

    it('should categorize MemoryError correctly', () => {
      const error = new MemoryError('Out of memory');
      const result = categorizeError(error);
      
      expect(result.type).toBe('memory');
      expect(result.userMessage).toBe('The file is too large to process.');
      expect(result.canRetry).toBe(true);
      expect(result.suggestions).toContain('Try with a smaller file');
    });

    it('should categorize TimeoutError correctly', () => {
      const error = new TimeoutError('Timed out');
      const result = categorizeError(error);
      
      expect(result.type).toBe('timeout');
      expect(result.userMessage).toBe('Processing took too long and was cancelled.');
      expect(result.canRetry).toBe(true);
      expect(result.suggestions).toContain('Try with a smaller file');
    });

    it('should categorize PDFProcessingError correctly', () => {
      const error = new PDFProcessingError('Processing failed');
      const result = categorizeError(error);
      
      expect(result.type).toBe('processing');
      expect(result.userMessage).toBe('Unable to process your PDF file.');
      expect(result.canRetry).toBe(true);
      expect(result.suggestions).toContain('Make sure the PDF is not corrupted');
    });

    it('should categorize network errors correctly', () => {
      const error = new Error('fetch failed');
      const result = categorizeError(error);
      
      expect(result.type).toBe('network');
      expect(result.userMessage).toBe('Network connection issue.');
      expect(result.canRetry).toBe(true);
      expect(result.suggestions).toContain('Check your internet connection');
    });

    it('should categorize unknown errors correctly', () => {
      const error = new Error('Unknown error');
      const result = categorizeError(error);
      
      expect(result.type).toBe('unknown');
      expect(result.userMessage).toBe('An unexpected error occurred.');
      expect(result.canRetry).toBe(true);
      expect(result.suggestions).toContain('Try refreshing the page');
    });
  });

  describe('createUserFriendlyError', () => {
    it('should create user-friendly error for validation errors', () => {
      const error = new FileValidationError('Invalid file');
      const result = createUserFriendlyError(error);
      
      expect(result.title).toBe('File Validation Error');
      expect(result.message).toBe('There was an issue with your file.');
      expect(result.canRetry).toBe(true);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should create user-friendly error for memory errors', () => {
      const error = new MemoryError('Out of memory');
      const result = createUserFriendlyError(error);
      
      expect(result.title).toBe('Memory Limit Exceeded');
      expect(result.message).toBe('The file is too large to process.');
      expect(result.canRetry).toBe(true);
    });
  });

  describe('createTimeoutPromise', () => {
    it('should resolve when promise completes before timeout', async () => {
      const promise = Promise.resolve('success');
      const result = await createTimeoutPromise(promise, 1000);
      
      expect(result).toBe('success');
    });

    it('should reject with TimeoutError when promise takes too long', async () => {
      const promise = new Promise(resolve => setTimeout(resolve, 2000));
      
      await expect(createTimeoutPromise(promise, 1000, 'Custom timeout'))
        .rejects.toThrow(TimeoutError);
    });

    it('should use custom timeout message', async () => {
      const promise = new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        await createTimeoutPromise(promise, 1000, 'Custom timeout message');
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect((error as TimeoutError).message).toBe('Custom timeout message');
      }
    });
  });

  describe('checkMemoryUsage', () => {
    it('should return memory usage information', () => {
      const result = checkMemoryUsage();
      
      expect(result).toHaveProperty('used');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('available');
      expect(typeof result.used).toBe('number');
      expect(typeof result.limit).toBe('number');
      expect(typeof result.available).toBe('number');
    });

    it('should calculate available memory correctly', () => {
      const result = checkMemoryUsage();
      expect(result.available).toBe(result.limit - result.used);
    });
  });

  describe('isMemoryLimitReached', () => {
    it('should return false when memory usage is below threshold', () => {
      // Mock low memory usage
      const originalMemory = (global.performance as any).memory;
      (global.performance as any).memory = {
        usedJSHeapSize: 50 * 1024 * 1024, // 50MB
        jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
      };

      const result = isMemoryLimitReached(0.9); // 90% threshold
      expect(result).toBe(false);

      // Restore original memory
      (global.performance as any).memory = originalMemory;
    });

    it('should return true when memory usage exceeds threshold', () => {
      // Mock high memory usage
      const originalMemory = (global.performance as any).memory;
      (global.performance as any).memory = {
        usedJSHeapSize: 95 * 1024 * 1024, // 95MB
        jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
      };

      const result = isMemoryLimitReached(0.9); // 90% threshold
      expect(result).toBe(true);

      // Restore original memory
      (global.performance as any).memory = originalMemory;
    });
  });

  describe('createRetryWrapper', () => {
    it('should succeed on first attempt', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = createRetryWrapper(mockFn, 3, 100);
      
      const result = await wrappedFn('arg1', 'arg2');
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success');
      
      const wrappedFn = createRetryWrapper(mockFn, 3, 10);
      
      const result = await wrappedFn();
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should not retry FileValidationError', async () => {
      const mockFn = jest.fn().mockRejectedValue(new FileValidationError('Invalid file'));
      const wrappedFn = createRetryWrapper(mockFn, 3, 10);
      
      await expect(wrappedFn()).rejects.toThrow(FileValidationError);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throw last error after max retries', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Persistent failure'));
      const wrappedFn = createRetryWrapper(mockFn, 2, 10);
      
      await expect(wrappedFn()).rejects.toThrow('Persistent failure');
      expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should wait between retries', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValue('success');
      
      const wrappedFn = createRetryWrapper(mockFn, 2, 100);
      
      const startTime = Date.now();
      await wrappedFn();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
  });
});