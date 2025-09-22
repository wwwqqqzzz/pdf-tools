// Google Analytics configuration and utilities
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Check if GA is enabled and tracking ID is available
export const isGAEnabled = () => {
  return (
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && 
    GA_TRACKING_ID && 
    typeof window !== 'undefined'
  );
};

// Initialize Google Analytics
export const initGA = () => {
  if (!isGAEnabled()) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });

  // Make gtag available globally
  (window as any).gtag = gtag;
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!isGAEnabled() || !(window as any).gtag) return;

  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!isGAEnabled() || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track PDF tool usage
export const trackPDFToolUsage = (
  toolName: string,
  action: 'start' | 'complete' | 'error',
  fileSize?: number,
  processingTime?: number
) => {
  trackEvent(action, 'PDF Tools', toolName, processingTime || fileSize);
};

// Track file uploads
export const trackFileUpload = (
  toolName: string,
  fileSize: number,
  fileType: string
) => {
  trackEvent('file_upload', 'PDF Tools', `${toolName}_${fileType}`, fileSize);
};

// Track downloads
export const trackDownload = (
  toolName: string,
  fileSize: number,
  processingTime: number
) => {
  trackEvent('download', 'PDF Tools', toolName, processingTime);
};

// Track errors
export const trackError = (
  toolName: string,
  errorType: string,
  errorMessage?: string
) => {
  trackEvent('error', 'PDF Tools', `${toolName}_${errorType}`);
  
  // Also send exception data
  if ((window as any).gtag) {
    (window as any).gtag('event', 'exception', {
      description: errorMessage || errorType,
      fatal: false,
    });
  }
};

// Track user engagement
export const trackEngagement = (
  action: string,
  element: string,
  value?: number
) => {
  trackEvent(action, 'User Engagement', element, value);
};

// Track performance metrics
export const trackPerformance = (
  metric: string,
  value: number,
  toolName?: string
) => {
  trackEvent('performance', 'Core Web Vitals', `${toolName || 'global'}_${metric}`, value);
};

// Enhanced ecommerce tracking (for future premium features)
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string = 'USD',
  items: any[] = []
) => {
  if (!isGAEnabled() || !(window as any).gtag) return;

  (window as any).gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  });
};

// Consent management (for GDPR compliance)
export const updateConsent = (
  adStorage: 'granted' | 'denied',
  analyticsStorage: 'granted' | 'denied'
) => {
  if (!isGAEnabled() || !(window as any).gtag) return;

  (window as any).gtag('consent', 'update', {
    ad_storage: adStorage,
    analytics_storage: analyticsStorage,
  });
};

// Set default consent (call before GA initialization)
export const setDefaultConsent = (
  adStorage: 'granted' | 'denied' = 'denied',
  analyticsStorage: 'granted' | 'denied' = 'denied'
) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }

  gtag('consent', 'default', {
    ad_storage: adStorage,
    analytics_storage: analyticsStorage,
    wait_for_update: 500,
  });
};

// Type definitions for window.gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}