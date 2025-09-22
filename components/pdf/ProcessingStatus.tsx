'use client';

import { motion } from 'framer-motion';

interface ProcessingStatusProps {
  status: 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  className?: string;
}

export default function ProcessingStatus({
  status,
  progress,
  message = 'Processing...',
  className = '',
}: ProcessingStatusProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {status === 'processing' && (
        <div className="space-y-6">
          {/* Animated spinner */}
          <div className="flex justify-center">
            <motion.div
              className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          
          {/* Progress bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{message}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
          
          {/* Processing message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Processing Your Files
            </h3>
            <p className="text-gray-600">
              Please wait while we process your PDF files. This usually takes just a few seconds.
            </p>
          </div>
          
          {/* Security reminder */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">
                Your files are processed locally in your browser for maximum security.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Processing Complete!
          </h3>
        </motion.div>
      )}
      
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Processing Failed
          </h3>
        </motion.div>
      )}
    </div>
  );
}