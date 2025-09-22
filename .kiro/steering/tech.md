# Technology Stack & Build System

## Core Framework

**Next.js 14 with App Router**
- TypeScript for type safety and better developer experience
- App Router for improved performance and SEO capabilities
- Server-side rendering (SSR) and static site generation (SSG) for optimal SEO

## Frontend Technologies

**UI & Styling**
- Tailwind CSS for rapid, responsive design
- Headless UI for accessible, unstyled components
- Framer Motion for smooth animations and transitions

**PDF Processing Libraries**
- `pdf-lib`: Core PDF manipulation (merge, split, compress, modify)
- `PDF.js`: PDF rendering and preview functionality
- Web Workers for non-blocking file processing

**State Management & Forms**
- Zustand for lightweight state management
- React Hook Form for efficient form handling
- React Query for data fetching and caching

## Build System & Development

**Package Manager**: npm or yarn
**Code Quality**
- ESLint + Prettier for code formatting
- TypeScript for type checking
- Husky for Git hooks and pre-commit validation

## Deployment & Infrastructure

**Primary Platform**: Vercel
- Automatic deployments from Git
- Edge functions for optimal performance
- Built-in analytics and monitoring

**CDN & DNS**: Cloudflare for global content delivery and DNS management

## Common Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

### Deployment
```bash
# Deploy to Vercel (automatic via Git)
git push origin main

# Manual deployment
vercel --prod

# Preview deployment
vercel
```

## Performance Requirements

- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **File Processing**: <3 seconds for files under 10MB
- **Memory Management**: Automatic cleanup after processing
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+

## Security Considerations

- Content Security Policy (CSP) implementation
- Client-side file validation and sanitization
- No server-side file storage or processing
- XSS protection through proper input handling

## Environment Variables

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=

# Google Adsense
NEXT_PUBLIC_ADSENSE_ID=

# Sentry (Error Monitoring)
SENTRY_DSN=

# Environment
NODE_ENV=production|development
```

## Key Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "pdf-lib": "^1.17.0",
  "pdfjs-dist": "^3.11.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.45.0",
  "framer-motion": "^10.16.0"
}
```