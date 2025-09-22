// Sentry monitoring - disabled for now
// import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const NODE_ENV = process.env.NODE_ENV;

export function initSentry() {
  // Sentry initialization disabled - install @sentry/nextjs to enable
  console.log('Sentry monitoring disabled');
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (NODE_ENV === 'production') {
    console.error('Error captured:', error, context);
  } else {
    console.error('Error captured:', error, context);
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}] ${message}`);
}

export function setUserContext(user: { id?: string; email?: string }) {
  console.log('User context set:', user);
}

export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  console.log(`[${category}] ${message}`, data);
}