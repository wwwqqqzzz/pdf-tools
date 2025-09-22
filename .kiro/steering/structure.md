# Project Structure & Organization

## Root Directory Structure

```
pdf-tools-website/
├── .kiro/                    # Kiro configuration and specs
│   ├── specs/               # Project specifications
│   └── steering/            # AI guidance documents
├── app/                     # Next.js App Router pages
├── components/              # Reusable React components
├── lib/                     # Utility functions and configurations
├── public/                  # Static assets
├── workers/                 # Web Worker files
├── types/                   # TypeScript type definitions
├── hooks/                   # Custom React hooks
├── styles/                  # Global styles and Tailwind config
└── tests/                   # Test files
```

## App Directory (Next.js App Router)

```
app/
├── globals.css              # Global styles
├── layout.tsx               # Root layout component
├── page.tsx                 # Homepage
├── loading.tsx              # Global loading UI
├── error.tsx                # Global error UI
├── not-found.tsx            # 404 page
├── sitemap.ts               # Dynamic sitemap generation
├── robots.ts                # Robots.txt configuration
├── merge-pdf/               # PDF merge tool page
│   ├── page.tsx
│   ├── loading.tsx
│   └── metadata.ts
├── split-pdf/               # PDF split tool page
├── compress-pdf/            # PDF compress tool page
├── pdf-to-word/             # PDF to Word conversion
├── word-to-pdf/             # Word to PDF conversion
├── pdf-to-jpg/              # PDF to image conversion
├── jpg-to-pdf/              # Image to PDF conversion
├── rotate-pdf/              # PDF rotation tool
├── add-watermark/           # Watermark tool
├── privacy/                 # Privacy policy page
├── terms/                   # Terms of service page
└── api/                     # API routes (minimal usage)
```

## Components Directory

```
components/
├── ui/                      # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── ProgressBar.tsx
│   └── Spinner.tsx
├── layout/                  # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── Sidebar.tsx
├── pdf/                     # PDF-specific components
│   ├── FileUploader.tsx
│   ├── PDFProcessor.tsx
│   ├── PDFPreview.tsx
│   ├── ProcessingStatus.tsx
│   └── ResultDownload.tsx
├── tools/                   # Tool-specific components
│   ├── ToolSelector.tsx
│   ├── ToolCard.tsx
│   ├── ToolOptions.tsx
│   └── ToolInstructions.tsx
├── seo/                     # SEO components
│   ├── MetaTags.tsx
│   ├── StructuredData.tsx
│   └── Breadcrumbs.tsx
└── ads/                     # Advertisement components
    ├── AdBanner.tsx
    ├── AdSidebar.tsx
    └── AdNative.tsx
```

## Lib Directory

```
lib/
├── pdf/                     # PDF processing utilities
│   ├── merge.ts
│   ├── split.ts
│   ├── compress.ts
│   ├── convert.ts
│   ├── rotate.ts
│   ├── watermark.ts
│   └── utils.ts
├── utils/                   # General utilities
│   ├── file-validation.ts
│   ├── error-handling.ts
│   ├── memory-management.ts
│   └── performance.ts
├── seo/                     # SEO utilities
│   ├── metadata.ts
│   ├── structured-data.ts
│   └── sitemap.ts
├── analytics/               # Analytics configuration
│   ├── google-analytics.ts
│   ├── adsense.ts
│   └── tracking.ts
└── config/                  # Configuration files
    ├── constants.ts
    ├── tools.ts
    └── environment.ts
```

## Workers Directory

```
workers/
├── pdf-processor.ts         # Main PDF processing worker
├── merge-worker.ts          # PDF merge operations
├── split-worker.ts          # PDF split operations
├── compress-worker.ts       # PDF compression
└── convert-worker.ts        # Format conversion
```

## Types Directory

```
types/
├── pdf.ts                   # PDF-related type definitions
├── tools.ts                 # Tool configuration types
├── ui.ts                    # UI component types
├── api.ts                   # API response types
└── global.ts                # Global type definitions
```

## Hooks Directory

```
hooks/
├── usePDFProcessor.ts       # PDF processing hook
├── useFileUpload.ts         # File upload management
├── useProgress.ts           # Progress tracking
├── useLocalStorage.ts       # Local storage management
└── useAnalytics.ts          # Analytics tracking
```

## Public Directory

```
public/
├── icons/                   # Tool and UI icons
├── images/                  # Static images
├── og-images/               # Open Graph images
├── favicon.ico
├── manifest.json            # PWA manifest
└── sw.js                    # Service worker
```

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (e.g., `FileUploader.tsx`)
- **Utilities**: kebab-case (e.g., `file-validation.ts`)
- **Pages**: kebab-case directories (e.g., `merge-pdf/`)
- **Hooks**: camelCase starting with "use" (e.g., `usePDFProcessor.ts`)

### Code Conventions
- **React Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names

### URL Structure
- Tool pages: `/tool-name` (e.g., `/merge-pdf`, `/split-pdf`)
- Static pages: `/page-name` (e.g., `/privacy`, `/terms`)
- All URLs use kebab-case for SEO optimization

## Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { NextPage } from 'next';

// 2. Third-party library imports
import { motion } from 'framer-motion';

// 3. Internal component imports
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/pdf/FileUploader';

// 4. Utility and hook imports
import { usePDFProcessor } from '@/hooks/usePDFProcessor';
import { validateFile } from '@/lib/utils/file-validation';

// 5. Type imports
import type { PDFTool, ProcessingOptions } from '@/types/pdf';
```

## Configuration Files Location

- **Tailwind**: `tailwind.config.js` (root)
- **TypeScript**: `tsconfig.json` (root)
- **ESLint**: `.eslintrc.json` (root)
- **Prettier**: `.prettierrc` (root)
- **Next.js**: `next.config.js` (root)
- **Package**: `package.json` (root)

## Environment-Specific Organization

### Development
- Hot reload for all components
- Source maps enabled
- Detailed error messages
- Development-only debugging tools

### Production
- Optimized builds with code splitting
- Minified assets
- Error boundaries for graceful failures
- Performance monitoring integration

## File Size Guidelines

- **Components**: Keep under 200 lines, split if larger
- **Utilities**: Single responsibility, focused functions
- **Pages**: Minimal logic, delegate to components and hooks
- **Workers**: Optimized for performance, minimal dependencies