export class PDFProcessingError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'PDFProcessingError';
  }
}

export class FileValidationError extends Error {
  constructor(
    message: string,
    public fileName?: string,
    public fileSize?: number
  ) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export class MemoryError extends Error {
  constructor(message: string, public memoryUsage?: number) {
    super(message);
    this.name = 'MemoryError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string, public timeoutMs?: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export interface ErrorInfo {
  type: 'validation' | 'processing' | 'memory' | 'timeout' | 'network' | 'unknown';
  message: string;
  userMessage: string;
  suggestions: string[];
  canRetry: boolean;
}

export function categorizeError(error: Error): ErrorInfo {
  if (error instanceof FileValidationError) {
    return {
      type: 'validation',
      message: error.message,
      userMessage: 'There was an issue with your file.',
      suggestions: [
        'Make sure your file is a valid PDF',
        'Check that the file size is under the limit',
        'Try with a different file',
      ],
      canRetry: true,
    };
  }

  if (error instanceof MemoryError) {
    return {
      type: 'memory',
      message: error.message,
      userMessage: 'The file is too large to process.',
      suggestions: [
        'Try with a smaller file',
        'Use our compress tool first',
        'Split large files into smaller parts',
        'Close other browser tabs to free up memory',
      ],
      canRetry: true,
    };
  }

  if (error instanceof TimeoutError) {
    return {
      type: 'timeout',
      message: error.message,
      userMessage: 'Processing took too long and was cancelled.',
      suggestions: [
        'Try with a smaller file',
        'Check your internet connection',
        'Try again in a few moments',
      ],
      canRetry: true,
    };
  }

  if (error instanceof PDFProcessingError) {
    return {
      type: 'processing',
      message: error.message,
      userMessage: 'Unable to process your PDF file.',
      suggestions: [
        'Make sure the PDF is not corrupted',
        'Try with a different PDF file',
        'Check if the PDF is password protected',
      ],
      canRetry: true,
    };
  }

  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return {
      type: 'network',
      message: error.message,
      userMessage: 'Network connection issue.',
      suggestions: [
        'Check your internet connection',
        'Try again in a few moments',
        'Refresh the page and try again',
      ],
      canRetry: true,
    };
  }

  // Unknown errors
  return {
    type: 'unknown',
    message: error.message,
    userMessage: 'An unexpected error occurred.',
    suggestions: [
      'Try refreshing the page',
      'Try with a different file',
      'Contact support if the problem persists',
    ],
    canRetry: true,
  };
}

export function createUserFriendlyError(error: Error): {
  title: string;
  message: string;
  suggestions: string[];
  canRetry: boolean;
} {
  const errorInfo = categorizeError(error);

  const titles = {
    validation: 'File Validation Error',
    processing: 'Processing Error',
    memory: 'Memory Limit Exceeded',
    timeout: 'Processing Timeout',
    network: 'Connection Error',
    unknown: 'Unexpected Error',
  };

  return {
    title: titles[errorInfo.type],
    message: errorInfo.userMessage,
    suggestions: errorInfo.suggestions,
    canRetry: errorInfo.canRetry,
  };
}

export function logError(error: Error, context?: Record<string, any>) {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    context,
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // In production, you would send this to your error tracking service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    // captureException(error, context);
  }
}

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: Record<string, any>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), context);
      throw error;
    }
  };
}

export function createTimeoutPromise<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(timeoutMessage, timeoutMs));
      }, timeoutMs);
    }),
  ]);
}

export function checkMemoryUsage(): { used: number; limit: number; available: number } {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      available: memory.jsHeapSizeLimit - memory.usedJSHeapSize,
    };
  }

  // Fallback for browsers that don't support performance.memory
  return {
    used: 0,
    limit: 100 * 1024 * 1024, // Assume 100MB limit
    available: 100 * 1024 * 1024,
  };
}

export function isMemoryLimitReached(threshold = 0.9): boolean {
  const memory = checkMemoryUsage();
  return memory.used / memory.limit > threshold;
}

export function createRetryWrapper<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries = 3,
  delayMs = 1000
) {
  return async (...args: T): Promise<R> => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry validation errors
        if (lastError instanceof FileValidationError) {
          throw lastError;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }

    throw lastError!;
  };
}