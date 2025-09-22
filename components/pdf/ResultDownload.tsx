'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon, ArrowPathIcon, ShareIcon } from '@heroicons/react/24/outline';
import { ProcessedFile } from '@/types/pdf';
import { formatFileSize } from '@/lib/utils/file-validation';

interface ResultDownloadProps {
  result: ProcessedFile;
  onReset: () => void;
  title?: string;
  description?: string;
  showShare?: boolean;
  className?: string;
}

export default function ResultDownload({
  result,
  onReset,
  title = 'File processed successfully!',
  description = 'Your file is ready for download.',
  showShare = true,
  className = '',
}: ResultDownloadProps) {
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        // Convert URL to File for sharing
        const response = await fetch(result.url);
        const blob = await response.blob();
        const file = new File([blob], result.name, { type: result.type });
        
        await navigator.share({
          title: 'PDF File',
          text: 'Check out this PDF file',
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing file:', error);
        // Fallback to copying URL
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  }, [result]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      // You could show a toast notification here
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link:', error);
    }
  }, [result.url]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`text-center py-8 ${className}`}
    >
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Title and description */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8">
        {description}
      </p>

      {/* File info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-lg mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">{result.name}</p>
            <p className="text-sm text-gray-500">
              {formatFileSize(result.size)}
              {result.pages && ` • ${result.pages} pages`}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleDownload}
          className="btn-primary flex items-center px-8 py-3 text-lg"
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
          Download File
        </button>
        
        {showShare && (
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center px-6 py-3"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            Share
          </button>
        )}
        
        <button
          onClick={onReset}
          className="btn-secondary flex items-center px-6 py-3"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Process Another File
        </button>
      </div>

      {/* Security note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-left">
            <p className="text-sm text-blue-700 font-medium mb-1">
              Privacy Protected
            </p>
            <p className="text-xs text-blue-600">
              Your file was processed locally in your browser. We never store or access your files.
            </p>
          </div>
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Try Other PDF Tools
        </h4>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/split-pdf"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            Split PDF
          </a>
          <a
            href="/compress-pdf"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            Compress PDF
          </a>
          <a
            href="/pdf-to-word"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            PDF to Word
          </a>
          <a
            href="/rotate-pdf"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            Rotate PDF
          </a>
        </div>
      </div>
    </motion.div>
  );
}