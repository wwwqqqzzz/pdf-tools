import '@testing-library/jest-dom';

// Mock PDF.js
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: jest.fn(() => Promise.resolve({
        getViewport: jest.fn(() => ({ width: 100, height: 100 })),
        render: jest.fn(() => ({ promise: Promise.resolve() })),
      })),
      getMetadata: jest.fn(() => Promise.resolve({
        info: {
          Title: 'Test PDF',
          Author: 'Test Author',
        },
      })),
    })),
  })),
}));

// Mock pdf-lib
jest.mock('pdf-lib', () => ({
  PDFDocument: {
    create: jest.fn(() => Promise.resolve({
      addPage: jest.fn(),
      copyPages: jest.fn(() => Promise.resolve([])),
      save: jest.fn(() => Promise.resolve(new Uint8Array([1, 2, 3]))),
      getPageCount: jest.fn(() => 1),
      setTitle: jest.fn(),
      setAuthor: jest.fn(),
      setSubject: jest.fn(),
      setCreator: jest.fn(),
      setProducer: jest.fn(),
    })),
    load: jest.fn(() => Promise.resolve({
      getPageCount: jest.fn(() => 1),
      getPages: jest.fn(() => []),
      getTitle: jest.fn(() => 'Test PDF'),
      getAuthor: jest.fn(() => 'Test Author'),
      getSubject: jest.fn(() => 'Test Subject'),
    })),
  },
}));

// Mock File API
global.File = class MockFile {
  constructor(chunks, filename, options = {}) {
    this.chunks = chunks;
    this.name = filename;
    this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    this.type = options.type || '';
    this.lastModified = Date.now();
  }

  arrayBuffer() {
    return Promise.resolve(new ArrayBuffer(this.size));
  }

  text() {
    return Promise.resolve(this.chunks.join(''));
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock performance.memory
Object.defineProperty(global.performance, 'memory', {
  value: {
    usedJSHeapSize: 10 * 1024 * 1024, // 10MB
    jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
  },
  writable: true,
});

// Mock Worker
global.Worker = class MockWorker {
  constructor(url) {
    this.url = url;
    this.onmessage = null;
    this.onerror = null;
  }

  postMessage(data) {
    // Simulate async worker response
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({
          data: {
            id: data.id,
            type: 'success',
            payload: new Uint8Array([1, 2, 3]),
          },
        });
      }
    }, 100);
  }

  terminate() {
    // Mock terminate
  }
};

// Suppress console errors in tests unless explicitly testing them
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});