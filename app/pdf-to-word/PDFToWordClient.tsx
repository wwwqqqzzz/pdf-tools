'use client';

import React, { useState, useCallback } from 'react';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { convertPDFToWord, validateConversionInput, ConvertResult } from '@/lib/pdf/convert';
import { validateFiles } from '@/lib/utils/file-validation';
import { FILE_CONFIG } from '@/lib/config/constants';

type ConversionStatus = 'idle' | 'processing' | 'completed' | 'error';

export default function PDFToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      setError('');
      
      // Validate file
      const validation = validateConversionInput(selectedFile, 'txt');
      
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
      const convertResult = await convertPDFToWord(file, {
        outputFormat: 'txt',
        onProgress: setProgress,
      });

      setResult(convertResult);
      setStatus('completed');
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setStatus('error');
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    if (result) {
      const blob = new Blob([result.data], { type: result.mimeType });
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
    setFile(null);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
            <div className="bg-orange-500 p-4 rounded-full">
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF to Word Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert PDF files to Word documents. Extract text content from your PDF and save as editable text format.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'idle' && (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors duration-200 mb-8"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-orange-500', 'bg-orange-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-orange-500', 'bg-orange-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-orange-500', 'bg-orange-50');
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  if (droppedFiles.length > 0) {
                    const droppedFile = droppedFiles[0];
                    const validation = validateConversionInput(droppedFile, 'txt');
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
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select PDF File to Convert
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a PDF file that you want to convert to Word format
                    </p>
                    <button 
                      type="button"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
                      <h4 className="text-sm font-medium text-blue-800">About PDF to Word Conversion</h4>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Extracts text content from your PDF file</li>
                          <li>Outputs as RTF format (opens in Word)</li>
                          <li>Preserves basic text structure and formatting</li>
                          <li>Compatible with Microsoft Word and other text editors</li>
                          <li>Note: Complex layouts may require manual adjustment</li>
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
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Convert to Word
                </button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-500 p-4 rounded-full">
                  <DocumentTextIcon className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Converting PDF to Word...
              </h3>
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
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
                Your PDF has been converted to Word format. Click below to download.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="text-sm text-gray-600">
                  <p><strong>Original:</strong> {(result.originalSize / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Converted:</strong> {(result.convertedSize / 1024).toFixed(2)} KB</p>
                  <p><strong>Format:</strong> RTF Document (Word Compatible)</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Download RTF File
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Convert Another File
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
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Conversion</h4>
            <p className="text-gray-600">All conversion happens in your browser. Your files never leave your device.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast Processing</h4>
            <p className="text-gray-600">Quick conversion with real-time progress tracking.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Completely Free</h4>
            <p className="text-gray-600">No registration required. Convert unlimited files for free.</p>
          </div>
        </div>
      </div>
    </div>
  );
}