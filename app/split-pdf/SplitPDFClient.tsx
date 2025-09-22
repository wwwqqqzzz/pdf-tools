'use client';

import { useState, useCallback } from 'react';
import { ScissorsIcon } from '@heroicons/react/24/outline';
import { validateFiles, formatFileSize } from '@/lib/utils/file-validation';
import { FILE_CONFIG } from '@/lib/config/constants';
import { splitPDF, SplitOptions } from '@/lib/pdf/split';

type SplitType = 'pages' | 'range' | 'extract';

export default function SplitPDFClient() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ files: Uint8Array[]; names: string[] } | null>(null);
  const [splitType, setSplitType] = useState<SplitType>('pages');
  const [pagesPerFile, setPagesPerFile] = useState(1);
  const [pageRanges, setPageRanges] = useState('1-5, 6-10');
  const [specificPages, setSpecificPages] = useState('1, 3, 5');

  const handleFileSelected = useCallback((selectedFiles: File[]) => {
    setError('');
    
    if (selectedFiles.length !== 1) {
      setError('Please select exactly one PDF file to split');
      return;
    }

    const selectedFile = selectedFiles[0];
    
    // Validate file
    const validation = validateFiles(
      [selectedFile],
      FILE_CONFIG.supportedPDFTypes,
      1,
      FILE_CONFIG.maxFileSize
    );
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    
    setFile(selectedFile);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles);
      setError('');
      
      if (filesArray.length !== 1) {
        setError('Please select exactly one PDF file to split');
        return;
      }

      const selectedFile = filesArray[0];
      
      // Validate file
      const validation = validateFiles(
        [selectedFile],
        FILE_CONFIG.supportedPDFTypes,
        1,
        FILE_CONFIG.maxFileSize
      );
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      
      setFile(selectedFile);
    }
  }, []);

  const handleSplit = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file to split');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    setProgress(0);
    
    try {
      let options: SplitOptions;
      
      switch (splitType) {
        case 'pages':
          options = {
            splitType: 'pages',
            pagesPerFile: pagesPerFile,
            onProgress: setProgress
          };
          break;
        case 'range':
          const ranges = pageRanges.split(',').map(range => {
            const [start, end] = range.trim().split('-').map(n => parseInt(n.trim()));
            return { start, end };
          });
          options = {
            splitType: 'range',
            pageRanges: ranges,
            onProgress: setProgress
          };
          break;
        case 'extract':
          const pages = specificPages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
          options = {
            splitType: 'extract',
            specificPages: pages,
            onProgress: setProgress
          };
          break;
      }
      
      const result = await splitPDF(file, options);
      setResults(result);
      setIsProcessing(false);
      setProgress(100);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to split PDF');
      setIsProcessing(false);
      setProgress(0);
    }
  }, [file, splitType, pagesPerFile, pageRanges, specificPages]);

  const handleReset = useCallback(() => {
    setFile(null);
    setError('');
    setIsProcessing(false);
    setProgress(0);
    setResults(null);
  }, []);

  const handleDownload = useCallback((fileData: Uint8Array, fileName: string) => {
    const blob = new Blob([new Uint8Array(fileData)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadAll = useCallback(() => {
    if (results) {
      results.files.forEach((fileData, index) => {
        setTimeout(() => {
          handleDownload(fileData, results.names[index]);
        }, index * 100); // Small delay between downloads
      });
    }
  }, [results, handleDownload]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">PDF Tools</a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/merge-pdf" className="text-gray-600 hover:text-gray-900">Merge PDF</a>
              <a href="/compress-pdf" className="text-gray-600 hover:text-gray-900">Compress PDF</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-4 rounded-full">
              <ScissorsIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Split PDF Files
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Split PDF files by pages, ranges, or extract specific pages. Fast, secure, and completely free.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!isProcessing && !results && (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors duration-200 mb-8"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-green-500', 'bg-green-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-green-500', 'bg-green-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-green-500', 'bg-green-50');
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  handleFileSelected(droppedFiles);
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
                    <ScissorsIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select PDF File to Split
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose one PDF file that you want to split into multiple files
                    </p>
                    <button 
                      type="button"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Choose File
                    </button>
                  </div>
                </label>
              </div>

              {file && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected File</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded mr-3">
                        <ScissorsIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Split Options */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Options</h3>
                
                <div className="space-y-4">
                  {/* Split Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Split Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="splitType"
                          value="pages"
                          checked={splitType === 'pages'}
                          onChange={(e) => setSplitType(e.target.value as SplitType)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">By Pages</div>
                          <div className="text-sm text-gray-500">Split every N pages</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="splitType"
                          value="range"
                          checked={splitType === 'range'}
                          onChange={(e) => setSplitType(e.target.value as SplitType)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">By Ranges</div>
                          <div className="text-sm text-gray-500">Split by page ranges</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="splitType"
                          value="extract"
                          checked={splitType === 'extract'}
                          onChange={(e) => setSplitType(e.target.value as SplitType)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">Extract Pages</div>
                          <div className="text-sm text-gray-500">Extract specific pages</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Split Configuration */}
                  {splitType === 'pages' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pages per file
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={pagesPerFile}
                        onChange={(e) => setPagesPerFile(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="1"
                      />
                    </div>
                  )}

                  {splitType === 'range' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page ranges (e.g., 1-5, 6-10, 11-15)
                      </label>
                      <input
                        type="text"
                        value={pageRanges}
                        onChange={(e) => setPageRanges(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="1-5, 6-10"
                      />
                    </div>
                  )}

                  {splitType === 'extract' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific pages (e.g., 1, 3, 5, 7)
                      </label>
                      <input
                        type="text"
                        value={specificPages}
                        onChange={(e) => setSpecificPages(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="1, 3, 5"
                      />
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleSplit}
                  disabled={!file}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <ScissorsIcon className="w-5 h-5 mr-2" />
                  Split PDF
                </button>
              </div>
            </>
          )}
          
          {isProcessing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Splitting PDF...
              </h3>
              <p className="text-gray-600 mb-4">
                Please wait while we split your PDF file.
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {results && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ScissorsIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                PDF split successfully!
              </h3>
              <p className="text-gray-600 mb-8">
                Your PDF has been split into {results.files.length} files.
              </p>
              
              <div className="mb-6">
                <button
                  onClick={handleDownloadAll}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 mb-4"
                >
                  Download All Files
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {results.files.map((fileData, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ScissorsIcon className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-sm">{results.names[index]}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(fileData, results.names[index])}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded transition-colors duration-200"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Split Another File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}