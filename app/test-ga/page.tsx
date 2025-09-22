'use client';

import { useEffect, useState } from 'react';

export default function TestGAPage() {
  const [gaStatus, setGAStatus] = useState<{
    gaId: string | undefined;
    analyticsEnabled: string | undefined;
    gtagLoaded: boolean;
    dataLayerExists: boolean;
  }>({
    gaId: undefined,
    analyticsEnabled: undefined,
    gtagLoaded: false,
    dataLayerExists: false,
  });

  useEffect(() => {
    // Check environment variables
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS;
    
    // Check if gtag is loaded
    const gtagLoaded = typeof (window as any).gtag === 'function';
    
    // Check if dataLayer exists
    const dataLayerExists = Array.isArray((window as any).dataLayer);

    setGAStatus({
      gaId,
      analyticsEnabled,
      gtagLoaded,
      dataLayerExists,
    });

    // Try to send a test event
    if (gtagLoaded) {
      (window as any).gtag('event', 'test_page_view', {
        event_category: 'Test',
        event_label: 'GA Test Page',
      });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Google Analytics 测试页面</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">环境变量检查</h2>
        <div className="space-y-2">
          <p>
            <strong>GA_ID:</strong> 
            <span className={gaStatus.gaId ? 'text-green-600' : 'text-red-600'}>
              {gaStatus.gaId || '未设置'}
            </span>
          </p>
          <p>
            <strong>Analytics 启用:</strong> 
            <span className={gaStatus.analyticsEnabled === 'true' ? 'text-green-600' : 'text-red-600'}>
              {gaStatus.analyticsEnabled || '未设置'}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Google Analytics 状态</h2>
        <div className="space-y-2">
          <p>
            <strong>gtag 函数加载:</strong> 
            <span className={gaStatus.gtagLoaded ? 'text-green-600' : 'text-red-600'}>
              {gaStatus.gtagLoaded ? '✓ 已加载' : '✗ 未加载'}
            </span>
          </p>
          <p>
            <strong>dataLayer 存在:</strong> 
            <span className={gaStatus.dataLayerExists ? 'text-green-600' : 'text-red-600'}>
              {gaStatus.dataLayerExists ? '✓ 存在' : '✗ 不存在'}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">调试信息</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre className="text-sm">
            {JSON.stringify({
              currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
              userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
              ...gaStatus,
            }, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            if ((window as any).gtag) {
              (window as any).gtag('event', 'manual_test', {
                event_category: 'Test',
                event_label: 'Manual Button Click',
              });
              alert('测试事件已发送！');
            } else {
              alert('gtag 未加载，无法发送事件');
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          发送测试事件
        </button>
      </div>
    </div>
  );
}