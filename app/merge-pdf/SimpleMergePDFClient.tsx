'use client';

import { useState, useCallback } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { validateFiles, formatFileSize } from '@/lib/utils/file-validation';
import { FILE_CONFIG } from '@/lib/config/constants';
import { mergePDFs } from '@/lib/pdf/merge';

export default function SimpleMergePDFClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setError('');
    
    // Validate files
    const validation = validateFiles(
      selectedFiles,
      FILE_CONFIG.supportedPDFTypes,
      FILE_CONFIG.maxFiles,
      FILE_CONFIG.maxFileSize
    );
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid files');
      return;
    }
    
    setFiles(selectedFiles);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFilesSelected(Array.from(selectedFiles));
    }
  }, [handleFilesSelected]);

  const handleMerge = useCallback(async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const mergedPDF = await mergePDFs(files, {
        onProgress: (progressValue) => {
          setProgress(progressValue);
        }
      });
      
      const blob = new Blob([new Uint8Array(mergedPDF)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        url,
        name: 'merged-document.pdf'
      });
      
      setIsProcessing(false);
      setProgress(100);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to merge PDFs');
      setIsProcessing(false);
      setProgress(0);
    }
  }, [files]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setError('');
    setIsProcessing(false);
    setProgress(0);
    if (result) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
  }, [result]);

  const handleDownload = useCallback(() => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [result]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">PDF Tools</a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-4 rounded-full">
              <DocumentDuplicateIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Merge PDF Files
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Combine multiple PDF files into one document. Fast, secure, and completely free.
            All processing happens in your browser.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 How to Select Multiple Files</h3>
          <div className="text-blue-800 space-y-1">
            <p><strong>Method 1:</strong> Drag and drop multiple PDF files into the upload area</p>
            <p><strong>Method 2:</strong> Click "Choose Files" and hold <kbd className="bg-blue-200 px-1 rounded">Ctrl</kbd> (Windows) or <kbd className="bg-blue-200 px-1 rounded">Cmd</kbd> (Mac) while clicking files</p>
            <p><strong>Method 3:</strong> Use "Add More Files" button to add files one by one</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!isProcessing && !result && (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  handleFilesSelected(droppedFiles);
                }}
              >
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select Multiple PDF Files to Merge
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop PDF files here, or click to browse.<br/>
                      <strong>Hold Ctrl/Cmd to select multiple files</strong>
                    </p>
                    <button 
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Choose Multiple Files
                    </button>
                  </div>
                </label>
                
                {/* Instructions */}
                <div className="mt-4 text-sm text-gray-500">
                  <p>💡 <strong>Tip:</strong> In the file dialog, hold Ctrl (Windows) or Cmd (Mac) and click multiple PDF files to select them all at once.</p>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {files.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Selected Files ({files.length})
                  </h3>
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded mr-3">
                            <DocumentDuplicateIcon className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove file"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={(e) => {
                        const newFiles = e.target.files;
                        if (newFiles) {
                          const additionalFiles = Array.from(newFiles);
                          setFiles(prev => [...prev, ...additionalFiles]);
                        }
                        // Reset input value to allow selecting the same files again
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="add-more-files"
                    />
                    <label 
                      htmlFor="add-more-files"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add More Files
                    </label>
                    
                    <button
                      onClick={handleMerge}
                      disabled={files.length < 2}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                      Merge {files.length} PDF Files
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          {isProcessing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Merging PDF Files...
              </h3>
              <p className="text-gray-600 mb-4">
                Please wait while we combine your PDF files.
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {result && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                PDF files merged successfully!
              </h3>
              <p className="text-gray-600 mb-8">
                Your merged PDF is ready for download.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4 4V3" />
                  </svg>
                  Download Merged PDF
                </button>
                
                <button
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Merge Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}