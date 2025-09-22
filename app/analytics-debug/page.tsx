'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkGA = () => {
      const info = {
        // 环境变量
        gaId: process.env.NEXT_PUBLIC_GA_ID,
        enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
        nodeEnv: process.env.NODE_ENV,
        
        // 浏览器环境
        currentUrl: window.location.href,
        userAgent: navigator.userAgent,
        
        // Google Analytics 状态
        gtagExists: typeof (window as any).gtag === 'function',
        dataLayerExists: Array.isArray((window as any).dataLayer),
        dataLayerLength: (window as any).dataLayer?.length || 0,
        
        // 脚本检查
        gaScriptLoaded: !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
        
        // 时间戳
        timestamp: new Date().toISOString(),
      };
      
      setDebugInfo(info);
    };

    // 立即检查
    checkGA();
    
    // 延迟检查（等待脚本加载）
    setTimeout(checkGA, 2000);
    setTimeout(checkGA, 5000);
  }, []);

  const sendTestEvent = () => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'debug_test', {
        event_category: 'Debug',
        event_label: 'Manual Test Event',
        custom_parameter: 'test_value'
      });
      alert('测试事件已发送到 Google Analytics');
    } else {
      alert('Google Analytics 未加载，无法发送事件');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Google Analytics 调试页面
        </h1>
        
        {/* 状态概览 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">状态概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded ${debugInfo.gaId ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm font-medium">GA ID</div>
              <div className={debugInfo.gaId ? 'text-green-800' : 'text-red-800'}>
                {debugInfo.gaId ? '✓ 已设置' : '✗ 未设置'}
              </div>
            </div>
            
            <div className={`p-3 rounded ${debugInfo.enableAnalytics === 'true' ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm font-medium">Analytics 启用</div>
              <div className={debugInfo.enableAnalytics === 'true' ? 'text-green-800' : 'text-red-800'}>
                {debugInfo.enableAnalytics === 'true' ? '✓ 已启用' : '✗ 未启用'}
              </div>
            </div>
            
            <div className={`p-3 rounded ${debugInfo.gtagExists ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm font-medium">gtag 函数</div>
              <div className={debugInfo.gtagExists ? 'text-green-800' : 'text-red-800'}>
                {debugInfo.gtagExists ? '✓ 已加载' : '✗ 未加载'}
              </div>
            </div>
            
            <div className={`p-3 rounded ${debugInfo.gaScriptLoaded ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm font-medium">GA 脚本</div>
              <div className={debugInfo.gaScriptLoaded ? 'text-green-800' : 'text-red-800'}>
                {debugInfo.gaScriptLoaded ? '✓ 已加载' : '✗ 未加载'}
              </div>
            </div>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">详细信息</h2>
          <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">测试功能</h2>
          <div className="space-y-4">
            <button
              onClick={sendTestEvent}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              发送测试事件
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg ml-4"
            >
              刷新页面
            </button>
          </div>
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            如何验证 Google Analytics 是否工作：
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>确保所有状态都显示为绿色（✓）</li>
            <li>点击"发送测试事件"按钮</li>
            <li>在 Google Analytics 实时报告中查看是否有活动用户</li>
            <li>检查浏览器开发者工具的网络标签，查看是否有发送到 google-analytics.com 的请求</li>
            <li>在控制台中查看是否有 GA 相关的日志信息</li>
          </ol>
        </div>
      </div>
    </div>
  );
}