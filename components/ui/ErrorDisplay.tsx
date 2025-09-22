'use client';

import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { createUserFriendlyError } from '@/lib/utils/error-handling';

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  onReset?: () => void;
  className?: string;
}

export default function ErrorDisplay({
  error,
  onRetry,
  onReset,
  className = '',
}: ErrorDisplayProps) {
  const errorInfo = createUserFriendlyError(error);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            {errorInfo.title}
          </h3>
          <p className="text-red-700 mb-4">
            {errorInfo.message}
          </p>
          
          {errorInfo.suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                Try these solutions:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {errorInfo.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            {errorInfo.canRetry && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Try Again
              </button>
            )}
            
            {onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Technical details (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 pt-4 border-t border-red-200">
          <summary className="text-sm font-medium text-red-900 cursor-pointer">
            Technical Details (Development Only)
          </summary>
          <div className="mt-2 p-3 bg-red-100 rounded text-xs font-mono text-red-800 overflow-auto">
            <div><strong>Error:</strong> {error.name}</div>
            <div><strong>Message:</strong> {error.message}</div>
            {error.stack && (
              <div className="mt-2">
                <strong>Stack:</strong>
                <pre className="whitespace-pre-wrap">{error.stack}</pre>
              </div>
            )}
          </div>
        </details>
      )}
    </motion.div>
  );
}