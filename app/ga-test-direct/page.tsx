'use client';

import Script from 'next/script';

export default function GATestDirectPage() {
  return (
    <>
      {/* 直接嵌入 Google Analytics 代码 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-H0794W951S"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H0794W951S', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true
          });
          
          console.log('Direct GA Test - Analytics loaded');
          
          // 发送测试事件
          gtag('event', 'page_view_test', {
            event_category: 'Direct Test',
            event_label: 'GA Direct Test Page',
            custom_parameter: 'direct_test_value'
          });
        `}
      </Script>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Google Analytics 直接测试页面
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">测试说明</h2>
            <p className="text-gray-700 mb-4">
              这个页面直接嵌入了 Google Analytics 代码（ID: G-H0794W951S），
              不依赖环境变量或其他配置。
            </p>
            <p className="text-gray-700">
              如果这个页面能在 Google Analytics 中检测到，说明问题出在环境变量配置上。
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              验证步骤：
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>打开浏览器开发者工具</li>
              <li>查看控制台是否有 "Direct GA Test - Analytics loaded" 日志</li>
              <li>查看网络标签是否有发送到 google-analytics.com 的请求</li>
              <li>在 Google Analytics 实时报告中查看是否有活动用户</li>
            </ol>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'manual_test_click', {
                    event_category: 'Direct Test',
                    event_label: 'Manual Button Click',
                  });
                  alert('测试事件已发送！');
                } else {
                  alert('gtag 未加载');
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              发送测试事件
            </button>
          </div>
        </div>
      </div>
    </>
  );
}