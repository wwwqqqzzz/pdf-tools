# Google Analytics Setup Guide

## Overview

Your PDF Tools website now has Google Analytics 4 (GA4) fully integrated with tracking ID: `G-H0794W951S`

## What's Been Implemented

### 1. Core Analytics Infrastructure

- **Google Analytics Library** (`lib/analytics/google-analytics.ts`)
  - Complete GA4 integration with gtag
  - Event tracking functions
  - Consent management for GDPR compliance
  - Performance and error tracking

- **Analytics Components** (`components/analytics/GoogleAnalytics.tsx`)
  - Client-side analytics initialization
  - Automatic page view tracking
  - Server-side script injection

- **Custom Hook** (`hooks/useAnalytics.ts`)
  - Easy-to-use analytics functions
  - PDF tool specific tracking
  - User interaction tracking

### 2. Tracking Implementation

The following events are now automatically tracked:

#### PDF Tool Events
- **Tool Start**: When user begins processing
- **Tool Complete**: When processing finishes successfully
- **Tool Error**: When processing fails
- **File Upload**: When files are selected
- **Download**: When user downloads results

#### User Interactions
- **Button Clicks**: All major buttons tracked
- **Page Views**: Automatic tracking on route changes
- **Feature Usage**: Tool-specific interactions
- **Navigation**: User journey through the site

#### Performance Metrics
- **Processing Time**: How long each operation takes
- **File Size**: Size of files being processed
- **Memory Usage**: Browser memory consumption
- **Core Web Vitals**: LCP, FID, CLS metrics

### 3. Environment Configuration

#### Development (.env.local)
```bash
NEXT_PUBLIC_GA_ID=G-H0794W951S
NEXT_PUBLIC_ENABLE_ANALYTICS=true  # Set to false to disable in dev
```

#### Production (.env.production)
```bash
NEXT_PUBLIC_GA_ID=G-H0794W951S
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Vercel Deployment Setup

### 1. Environment Variables in Vercel Dashboard

Add these environment variables in your Vercel project settings:

```bash
NEXT_PUBLIC_GA_ID=G-H0794W951S
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Automatic Deployment

The analytics will automatically work when you deploy to Vercel. The tracking code is included in the HTML head and will start collecting data immediately.

## Google Analytics Dashboard Setup

### 1. Verify Installation

1. Go to your GA4 property: https://analytics.google.com/
2. Navigate to Reports > Realtime
3. Visit your website and verify events are appearing

### 2. Recommended Custom Reports

Create these custom reports in GA4:

#### PDF Tool Performance Report
- **Metrics**: Event count, Average processing time
- **Dimensions**: Tool name, File size range
- **Filters**: Event name contains "pdf_tool"

#### User Journey Report
- **Metrics**: Sessions, Conversions
- **Dimensions**: Page path, Event name
- **Filters**: Event category = "User Engagement"

#### Error Tracking Report
- **Metrics**: Error count, Error rate
- **Dimensions**: Tool name, Error type
- **Filters**: Event name = "error"

### 3. Goals and Conversions

Set up these conversion events:

1. **Tool Completion**: `pdf_tool_complete`
2. **File Download**: `download`
3. **Multiple Tool Usage**: Custom audience of users who used 2+ tools

## Privacy and GDPR Compliance

### 1. Consent Management

The analytics implementation includes consent management:

```typescript
// Set default consent (before GA loads)
setDefaultConsent('denied', 'denied');

// Update consent when user accepts
updateConsent('granted', 'granted');
```

### 2. Data Collection

- **IP Anonymization**: Automatically enabled in GA4
- **No PII Collection**: Only anonymous usage data
- **Client-side Processing**: Files never leave user's browser

### 3. Privacy Policy Updates

Ensure your privacy policy mentions:
- Google Analytics usage
- Cookie usage for analytics
- User's right to opt-out
- Data retention policies

## Monitoring and Optimization

### 1. Key Metrics to Watch

- **Tool Usage**: Which PDF tools are most popular
- **Processing Performance**: Average processing times
- **Error Rates**: Which tools have issues
- **User Flow**: How users navigate between tools
- **Conversion Rates**: Tool completion rates

### 2. Performance Optimization

Monitor these GA4 reports:
- **Page Speed**: Core Web Vitals
- **User Engagement**: Session duration, pages per session
- **Tool Efficiency**: Processing time vs file size

### 3. A/B Testing Setup

Use GA4 audiences for testing:
- New vs returning users
- Mobile vs desktop users
- Different tool usage patterns

## Troubleshooting

### 1. Analytics Not Working

Check these items:
1. Verify `NEXT_PUBLIC_GA_ID` is set correctly
2. Ensure `NEXT_PUBLIC_ENABLE_ANALYTICS=true`
3. Check browser console for gtag errors
4. Verify network requests to Google Analytics

### 2. Events Not Appearing

1. Check GA4 Realtime reports (events appear within minutes)
2. Verify event names match GA4 requirements
3. Check browser ad blockers aren't blocking GA

### 3. Development vs Production

- Development: Analytics enabled for testing
- Production: Full analytics with all features
- Use GA4 Debug View for development testing

## Advanced Features

### 1. Enhanced Ecommerce (Future)

Ready for premium features:
```typescript
trackPurchase(transactionId, value, currency, items);
```

### 2. Custom Dimensions

Add these custom dimensions in GA4:
- Tool Name
- File Size Range
- Processing Time Range
- Error Type

### 3. Audience Segmentation

Create audiences for:
- Power users (multiple tool usage)
- Mobile users
- Large file processors
- Error-prone sessions

## Next Steps

1. **Deploy to Production**: Push changes to trigger Vercel deployment
2. **Verify Tracking**: Check GA4 Realtime reports
3. **Set Up Alerts**: Configure GA4 alerts for errors or traffic drops
4. **Create Dashboards**: Build custom reports for business metrics
5. **Monitor Performance**: Track Core Web Vitals and user experience

## Support

If you need help with analytics:
1. Check GA4 documentation: https://support.google.com/analytics/
2. Verify implementation in browser dev tools
3. Use GA4 Debug View for detailed event tracking
4. Monitor Vercel deployment logs for any errors

Your analytics are now fully configured and ready to provide valuable insights into your PDF tools usage!