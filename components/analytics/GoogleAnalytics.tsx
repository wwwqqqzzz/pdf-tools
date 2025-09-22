'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, trackPageView, isGAEnabled } from '@/lib/analytics/google-analytics';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize GA on component mount
    initGA();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (isGAEnabled()) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}

// Alternative: Google Analytics Script component for server-side rendering
export function GoogleAnalyticsScript() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

  if (!isEnabled || !GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true
            });
            
            // Debug log
            console.log('Google Analytics initialized with ID: ${GA_TRACKING_ID}');
          `,
        }}
      />
    </>
  );
}