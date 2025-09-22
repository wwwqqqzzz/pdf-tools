export const APP_CONFIG = {
  name: 'PDF Tools',
  description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files',
  url: 'https://pdftools.com',
  version: '1.0.0',
} as const;

export const FILE_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB for free users - 提升限制以支持更多用例
  maxFileSizePremium: 200 * 1024 * 1024, // 200MB for premium users
  maxFiles: 10,
  maxFilesPremium: 50,
  supportedPDFTypes: ['application/pdf'] as string[],
  supportedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] as string[],
  supportedDocTypes: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', // 添加TXT支持
  ] as string[],
  processingTimeout: 60000, // 60 seconds - 增加超时时间
  
  // 不同功能的特定限制
  limits: {
    merge: { maxFiles: 20, maxSize: 50 * 1024 * 1024 },
    split: { maxFiles: 1, maxSize: 100 * 1024 * 1024 },
    compress: { maxFiles: 1, maxSize: 50 * 1024 * 1024 },
    convert: { maxFiles: 1, maxSize: 25 * 1024 * 1024 },
    watermark: { maxFiles: 1, maxSize: 50 * 1024 * 1024 },
    rotate: { maxFiles: 1, maxSize: 100 * 1024 * 1024 },
    imageConvert: { maxFiles: 10, maxSize: 25 * 1024 * 1024 },
  }
} as const;

export const PROCESSING_CONFIG = {
  chunkSize: 1024 * 1024, // 1MB chunks for large files
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB max memory usage
  compressionLevels: {
    low: 0.3,
    medium: 0.6,
    high: 0.9,
  },
} as const;

export const SEO_CONFIG = {
  defaultTitle: 'PDF Tools - Free Online PDF Editor & Converter',
  titleTemplate: '%s | PDF Tools',
  defaultDescription: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files. Fast, secure, and private - all processing happens in your browser.',
  keywords: [
    'PDF tools',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'PDF to Word',
    'Word to PDF',
    'PDF converter',
    'online PDF editor',
    'free PDF tools',
    'secure PDF processing',
  ],
} as const;

export const ANALYTICS_CONFIG = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID,
} as const;