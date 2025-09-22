'use client';

import React, { useState, useCallback } from 'react';
import { PhotoIcon, ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { convertImageToPDF, validateImageConversionInput, ImageConvertResult } from '@/lib/pdf/image-convert';

type ConversionStatus = 'idle' | 'processing' | 'completed' | 'error';

export default function JPGToPDFClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImageConvertResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles);
      setError('');
      
      // Validate files
      const validation = validateImageConversionInput(filesArray, 'image-to-pdf');
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid files');
        return;
      }
      
      setFiles(filesArray);
      setResult(null);
      setStatus('idle');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length > 0) {
      const validation = validateImageConversionInput(droppedFiles, 'image-to-pdf');
      if (validation.isValid) {
        setFiles(droppedFiles);
        setError('');
      } else {
        setError(validation.error || 'Invalid files');
      }
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleConvert = useCallback(async () => {
    if (files.length === 0) {
      setError('Please select image files to convert');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setError('');

    try {
      const convertResult = await convertImageToPDF(files, {
        onProgress: setProgress,
      });

      setResult(convertResult);
      setStatus('completed');
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setStatus('error');
    }
  }, [files]);

  const handleDownload = useCallback(() => {
    if (result && result.data) {
      const blob = new Blob([new Uint8Array(result.data)], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">PDF Tools</a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/merge-pdf" className="text-gray-600 hover:text-gray-900">Merge PDF</a>
              <a href="/split-pdf" className="text-gray-600 hover:text-gray-900">Split PDF</a>
              <a href="/compress-pdf" className="text-gray-600 hover:text-gray-900">Compress PDF</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-500 p-4 rounded-full">
              <PhotoIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JPG to PDF Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert JPG, PNG, and other images to PDF documents. Combine multiple images into a single PDF file.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'idle' && (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors duration-200 mb-8"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
                }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
                  handleDrop(e);
                }}
              >
                <input
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileInputChange}
                  multiple
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select Images to Convert
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose JPG, PNG, or other image files to combine into a PDF
                    </p>
                    <button 
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Choose Images
                    </button>
                  </div>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Selected Images ({files.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg p-3">
                        <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onLoad={(e) => {
                              // Clean up object URL after image loads
                              setTimeout(() => {
                                URL.revokeObjectURL((e.target as HTMLImageElement).src);
                              }, 1000);
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supported Formats */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Formats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <h4 className="font-medium text-blue-900 mb-1">JPG/JPEG</h4>
                    <p className="text-xs text-blue-700">Most common format</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <h4 className="font-medium text-blue-900 mb-1">PNG</h4>
                    <p className="text-xs text-blue-700">Transparent backgrounds</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <h4 className="font-medium text-blue-900 mb-1">GIF</h4>
                    <p className="text-xs text-blue-700">Animated images</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <h4 className="font-medium text-blue-900 mb-1">WebP</h4>
                    <p className="text-xs text-blue-700">Modern format</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleConvert}
                  disabled={files.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <PhotoIcon className="w-5 h-5 mr-2" />
                  Convert to PDF
                </button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-500 p-4 rounded-full">
                  <PhotoIcon className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Converting Images to PDF...
              </h3>
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-600">{progress}% complete</p>
              </div>
            </div>
          )}

          {status === 'completed' && result && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500 p-4 rounded-full">
                  <ArrowDownTrayIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Conversion Completed!
              </h3>
              <p className="text-gray-600 mb-6">
                Your images have been converted to PDF format. Click below to download.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="text-sm text-gray-600">
                  <p><strong>Images:</strong> {files.length} files</p>
                  <p><strong>Total Size:</strong> {(result.originalSize / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>PDF Size:</strong> {(result.convertedSize / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Pages:</strong> {result.pageCount}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Convert More Images
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-red-500 p-4 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Conversion Failed
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h4>
            <p className="text-gray-600">Support for JPG, PNG, GIF, WebP and other common image formats.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h4>
            <p className="text-gray-600">All conversion happens locally. Your images never leave your device.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Batch Processing</h4>
            <p className="text-gray-600">Convert multiple images at once into a single organized PDF document.</p>
          </div>
        </div>
      </div>
    </div>
  );
}