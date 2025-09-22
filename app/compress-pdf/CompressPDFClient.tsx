'use client';

import { useState, useCallback } from 'react';
import { ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { validateFiles, formatFileSize } from '@/lib/utils/file-validation';
import { FILE_CONFIG } from '@/lib/config/constants';
import { compressPDF, CompressOptions, formatCompressionResult } from '@/lib/pdf/compress';

type QualityType = 'low' | 'medium' | 'high';

export default function CompressPDFClient() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ data: Uint8Array; stats: string; fileName: string } | null>(null);
  const [quality, setQuality] = useState<QualityType>('medium');

  const handleFileSelected = useCallback((selectedFiles: File[]) => {
    setError('');
    
    if (selectedFiles.length !== 1) {
      setError('Please select exactly one PDF file to compress');
      return;
    }

    const selectedFile = selectedFiles[0];
    
    // Validate file
    const validation = validateFiles(
      [selectedFile],
      FILE_CONFIG.supportedPDFTypes,
      1,
      50 * 1024 * 1024 // 50MB limit for compression
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
        setError('Please select exactly one PDF file to compress');
        return;
      }

      const selectedFile = filesArray[0];
      
      // Validate file
      const validation = validateFiles(
        [selectedFile],
        FILE_CONFIG.supportedPDFTypes,
        1,
        50 * 1024 * 1024 // 50MB limit for compression
      );
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      
      setFile(selectedFile);
    }
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file to compress');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const options: CompressOptions = {
        quality: quality,
        onProgress: setProgress
      };
      
      const compressResult = await compressPDF(file, options);
      
      setResult({
        data: compressResult.data,
        stats: formatCompressionResult(compressResult),
        fileName: file.name.replace('.pdf', '_compressed.pdf')
      });
      
      setIsProcessing(false);
      setProgress(100);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to compress PDF');
      setIsProcessing(false);
      setProgress(0);
    }
  }, [file, quality]);

  const handleReset = useCallback(() => {
    setFile(null);
    setError('');
    setIsProcessing(false);
    setProgress(0);
    setResult(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (result) {
      const blob = new Blob([new Uint8Array(result.data)], { type: 'application/pdf' });
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

  const getQualityDescription = (q: QualityType) => {
    switch (q) {
      case 'low':
        return 'Maximum compression, lower quality';
      case 'medium':
        return 'Balanced compression and quality';
      case 'high':
        return 'Minimal compression, best quality';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
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
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-500 p-4 rounded-full">
              <ArrowsPointingInIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compress PDF Files
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reduce PDF file size without losing quality. Choose your compression level and optimize your files.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!isProcessing && !result && (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors duration-200 mb-8"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-purple-500', 'bg-purple-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
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
                    <ArrowsPointingInIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select PDF File to Compress
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a PDF file that you want to reduce in size
                    </p>
                    <button 
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
                        <ArrowsPointingInIcon className="w-5 h-5 text-red-600" />
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

              {/* Compression Quality */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Quality</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['low', 'medium', 'high'] as QualityType[]).map((q) => (
                    <label key={q} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="quality"
                        value={q}
                        checked={quality === q}
                        onChange={(e) => setQuality(e.target.value as QualityType)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium capitalize">{q} Quality</div>
                        <div className="text-sm text-gray-500">{getQualityDescription(q)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleCompress}
                  disabled={!file}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <ArrowsPointingInIcon className="w-5 h-5 mr-2" />
                  Compress PDF
                </button>
              </div>
            </>
          )}
          
          {isProcessing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Compressing PDF...
              </h3>
              <p className="text-gray-600 mb-4">
                Please wait while we optimize your PDF file.
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {result && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowsPointingInIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                PDF compressed successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                {result.stats}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={handleDownload}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4 4V3" />
                  </svg>
                  Download Compressed PDF
                </button>
                
                <button
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Compress Another File
                </button>
              </div>

              {/* Compression Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Compression Tips</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Low quality gives maximum compression but may reduce image quality</li>
                  <li>• High quality preserves quality but provides minimal compression</li>
                  <li>• Medium quality offers the best balance for most documents</li>
                  <li>• Files with many images compress better than text-only documents</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}