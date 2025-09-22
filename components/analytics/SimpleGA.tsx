import Script from 'next/script';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function SimpleGA() {
  // 只在生产环境且有 GA ID 时加载
  if (process.env.NODE_ENV !== 'production' || !GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true
          });
          
          // 调试信息
          console.log('Google Analytics loaded with ID: ${GA_TRACKING_ID}');
          console.log('Current URL:', window.location.href);
        `}
      </Script>
    </>
  );
}