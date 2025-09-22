'use client';

import { useState, useCallback } from 'react';
import { DocumentDuplicateIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';
import { validateFiles } from '@/lib/utils/file-validation';
import { FILE_CONFIG } from '@/lib/config/constants';
import FileUploader from '@/components/pdf/FileUploader';
import ProcessingStatus from '@/components/pdf/ProcessingStatus';
import ResultDownload from '@/components/pdf/ResultDownload';

export default function MergePDFClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const { state, mergePDFs, reset } = usePDFProcessor();

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

  const handleMerge = useCallback(async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }
    
    setError('');
    await mergePDFs(files);
  }, [files, mergePDFs]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setError('');
    reset();
  }, [reset]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleReorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, removed);
      return newFiles;
    });
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

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {state.status === 'idle' && (
            <>
              <FileUploader
                onFilesSelected={handleFilesSelected}
                acceptedTypes={FILE_CONFIG.supportedPDFTypes}
                maxFiles={FILE_CONFIG.maxFiles}
                maxFileSize={FILE_CONFIG.maxFileSize}
                multiple={true}
                title="Select PDF files to merge"
                description="Choose multiple PDF files that you want to combine into one document"
              />
              
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
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
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
                  
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleMerge}
                      disabled={files.length < 2}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                      Merge {files.length} PDF Files
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          {(state.status === 'processing') && (
            <ProcessingStatus
              status={state.status}
              progress={state.progress}
              message="Merging PDF files..."
            />
          )}
          
          {state.status === 'completed' && state.result && (
            <ResultDownload
              result={state.result}
              onReset={handleReset}
              title="PDF files merged successfully!"
              description="Your merged PDF is ready for download."
            />
          )}
          
          {state.status === 'error' && (
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Merge Failed
                </h3>
                <p className="text-red-700 mb-4">
                  {state.error || 'An error occurred while merging the PDF files.'}
                </p>
                <button
                  onClick={handleReset}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How to Use Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to Merge PDF Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Select Files</h3>
              <p className="text-gray-600">
                Choose multiple PDF files from your device that you want to merge.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Arrange Order</h3>
              <p className="text-gray-600">
                The files will be merged in the order they appear. Reorder if needed.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Download</h3>
              <p className="text-gray-600">
                Click merge and download your combined PDF file instantly.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is it safe to merge PDFs online?
              </h3>
              <p className="text-gray-600">
                Yes, absolutely! All PDF processing happens directly in your browser. 
                Your files are never uploaded to our servers, ensuring complete privacy and security.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How many PDF files can I merge at once?
              </h3>
              <p className="text-gray-600">
                You can merge up to {FILE_CONFIG.maxFiles} PDF files at once, with each file 
                being up to {Math.round(FILE_CONFIG.maxFileSize / (1024 * 1024))}MB in size.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Will the quality of my PDFs be affected?
              </h3>
              <p className="text-gray-600">
                No, the merge process preserves the original quality of your PDF files. 
                The merged document will maintain all text, images, and formatting.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change the order of pages after merging?
              </h3>
              <p className="text-gray-600">
                You can arrange the order of files before merging. Once merged, you would 
                need to use our split tool to separate pages and merge them again in a different order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}