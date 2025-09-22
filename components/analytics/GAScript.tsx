import Script from 'next/script';

interface GAScriptProps {
  gaId: string;
}

export default function GAScript({ gaId }: GAScriptProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true
          });
          console.log('Google Analytics initialized with ID: ${gaId}');
        `}
      </Script>
    </>
  );
}