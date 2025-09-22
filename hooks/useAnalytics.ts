'use client';

import { useCallback } from 'react';
import {
  trackEvent,
  trackPDFToolUsage,
  trackFileUpload,
  trackDownload,
  trackError,
  trackEngagement,
  trackPerformance,
} from '@/lib/analytics/google-analytics';

export function useAnalytics() {
  // Track PDF tool events
  const trackToolStart = useCallback((toolName: string) => {
    trackPDFToolUsage(toolName, 'start');
  }, []);

  const trackToolComplete = useCallback((
    toolName: string,
    processingTime: number,
    fileSize?: number
  ) => {
    trackPDFToolUsage(toolName, 'complete', fileSize, processingTime);
  }, []);

  const trackToolError = useCallback((
    toolName: string,
    errorType: string,
    errorMessage?: string
  ) => {
    trackPDFToolUsage(toolName, 'error');
    trackError(toolName, errorType, errorMessage);
  }, []);

  // Track file operations
  const trackUpload = useCallback((
    toolName: string,
    fileSize: number,
    fileType: string
  ) => {
    trackFileUpload(toolName, fileSize, fileType);
  }, []);

  const trackDownloadComplete = useCallback((
    toolName: string,
    fileSize: number,
    processingTime: number
  ) => {
    trackDownload(toolName, fileSize, processingTime);
  }, []);

  // Track user interactions
  const trackButtonClick = useCallback((buttonName: string, location?: string) => {
    trackEngagement('click', `button_${buttonName}${location ? `_${location}` : ''}`);
  }, []);

  const trackFeatureUsage = useCallback((featureName: string, value?: number) => {
    trackEngagement('feature_use', featureName, value);
  }, []);

  const trackPageInteraction = useCallback((
    action: string,
    element: string,
    value?: number
  ) => {
    trackEngagement(action, element, value);
  }, []);

  // Track performance metrics
  const trackProcessingTime = useCallback((
    toolName: string,
    timeMs: number
  ) => {
    trackPerformance('processing_time', timeMs, toolName);
  }, []);

  const trackFileSize = useCallback((
    toolName: string,
    sizeBytes: number
  ) => {
    trackPerformance('file_size', sizeBytes, toolName);
  }, []);

  const trackMemoryUsage = useCallback((
    toolName: string,
    memoryMB: number
  ) => {
    trackPerformance('memory_usage', memoryMB, toolName);
  }, []);

  // Track custom events
  const trackCustomEvent = useCallback((
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    trackEvent(action, category, label, value);
  }, []);

  // Track conversion events (for future premium features)
  const trackConversion = useCallback((
    conversionType: string,
    value?: number
  ) => {
    trackEvent('conversion', 'Premium Features', conversionType, value);
  }, []);

  // Track user journey
  const trackUserJourney = useCallback((
    step: string,
    toolName?: string
  ) => {
    trackEvent('user_journey', 'Navigation', `${toolName || 'general'}_${step}`);
  }, []);

  return {
    // Tool tracking
    trackToolStart,
    trackToolComplete,
    trackToolError,
    
    // File operations
    trackUpload,
    trackDownloadComplete,
    
    // User interactions
    trackButtonClick,
    trackFeatureUsage,
    trackPageInteraction,
    
    // Performance
    trackProcessingTime,
    trackFileSize,
    trackMemoryUsage,
    
    // Custom events
    trackCustomEvent,
    trackConversion,
    trackUserJourney,
  };
}