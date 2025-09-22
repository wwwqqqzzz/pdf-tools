'use client';

import React, { useState, useCallback } from 'react';
import { PhotoIcon, ArrowDownTrayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { convertPDFToImage, validateImageConversionInput, ImageConvertResult } from '@/lib/pdf/image-convert';

type ConversionStatus = 'idle' | 'processing' | 'completed' | 'error';
type Quality = 'low' | 'medium' | 'high';

export default function PDFToJPGClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImageConvertResult | null>(null);
  const [error, setError] = useState<string>('');
  const [quality, setQuality] = useState<Quality>('medium');

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      setError('');
      
      const validation = validateImageConversionInput([selectedFile], 'pdf-to-image');
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      setStatus('idle');
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file to convert');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setError('');

    try {
      const convertResult = await convertPDFToImage(file, {
        format: 'jpg',
        quality,
        onProgress: setProgress,
      });

      setResult(convertResult);
      setStatus('completed');
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setStatus('error');
    }
  }, [file, quality]);

  const handleDownloadAll = useCallback(async () => {
    if (!result || !result.images) return;

    try {
      // Create a ZIP file with all images
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();

      result.images.forEach((imageData, index) => {
        // Convert base64 to blob
        const base64Data = imageData.split(',')[1];
        const binaryData = atob(base64Data);
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }
        
        const fileName = `page-${index + 1}.jpg`;
        zip.file(fileName, bytes);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file?.name.replace(/\.pdf$/i, '-images.zip') || 'pdf-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create ZIP:', error);
      setError('Failed to create download package');
    }
  }, [result, file]);

  const handleDownloadSingle = useCallback((imageData: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `page-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
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
            <div className="bg-pink-500 p-4 rounded-full">
              <PhotoIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF to JPG Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert PDF pages to high-quality JPG images. Extract images from your PDF documents easily and securely.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'idle' && (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors duration-200 mb-8"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-pink-500', 'bg-pink-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-pink-500', 'bg-pink-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-pink-500', 'bg-pink-50');
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  if (droppedFiles.length > 0) {
                    const droppedFile = droppedFiles[0];
                    const validation = validateImageConversionInput([droppedFile], 'pdf-to-image');
                    if (validation.isValid) {
                      setFile(droppedFile);
                      setError('');
                    } else {
                      setError(validation.error || 'Invalid file');
                    }
                  }
                }}
              >
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select PDF File to Convert
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a PDF file to convert each page to JPG images
                    </p>
                    <button 
                      type="button"
                      className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Choose PDF File
                    </button>
                  </div>
                </label>
              </div>

              {file && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected File</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quality Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Cog6ToothIcon className="w-5 h-5 mr-2" />
                  Conversion Settings
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Quality
                    </label>
                    <div className="flex space-x-4">
                      {(['low', 'medium', 'high'] as Quality[]).map((q) => (
                        <label key={q} className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            value={q}
                            checked={quality === q}
                            onChange={(e) => setQuality(e.target.value as Quality)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 capitalize">{q}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Higher quality produces larger file sizes but better image clarity
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion Info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Details</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">About PDF to JPG Conversion</h4>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Each PDF page will be converted to a separate JPG image</li>
                          <li>Images maintain original page proportions and quality</li>
                          <li>All images can be downloaded individually or as a ZIP file</li>
                          <li>Conversion happens entirely in your browser for privacy</li>
                          <li>Supports multi-page PDFs with batch processing</li>
                        </ul>
                      </div>
                    </div>
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
                  disabled={!file}
                  className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <PhotoIcon className="w-5 h-5 mr-2" />
                  Convert to JPG
                </button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-pink-500 p-4 rounded-full">
                  <PhotoIcon className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Converting PDF to JPG Images...
              </h3>
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-600">{progress}% complete</p>
              </div>
            </div>
          )}

          {status === 'completed' && result && result.images && (
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-500 p-4 rounded-full">
                    <ArrowDownTrayIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Conversion Completed!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your PDF has been converted to {result.images.length} JPG image{result.images.length > 1 ? 's' : ''}.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="text-sm text-gray-600">
                    <p><strong>Pages Converted:</strong> {result.images.length}</p>
                    <p><strong>Quality:</strong> {quality.charAt(0).toUpperCase() + quality.slice(1)}</p>
                    <p><strong>Format:</strong> JPG Images</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    onClick={handleDownloadAll}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Download All as ZIP
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Convert Another File
                  </button>
                </div>
              </div>

              {/* Individual Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.images.map((imageData, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="aspect-[3/4] mb-3 bg-white rounded border overflow-hidden">
                      <img
                        src={imageData}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Page {index + 1}
                      </span>
                      <button
                        onClick={() => handleDownloadSingle(imageData, index)}
                        className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
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
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">High Quality Images</h4>
            <p className="text-gray-600">Extract images with customizable quality and resolution settings.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h4>
            <p className="text-gray-600">All conversion happens locally. Your files never leave your device.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Batch Download</h4>
            <p className="text-gray-600">Download all converted images at once in a convenient ZIP file.</p>
          </div>
        </div>
      </div>
    </div>
  );
}