'use client';

import React, { useState, useCallback } from 'react';
import { PaintBrushIcon, ArrowDownTrayIcon, PhotoIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { addWatermarkToPDF, validateWatermarkInput, WatermarkResult, getWatermarkPositionDescription } from '@/lib/pdf/watermark';

type WatermarkStatus = 'idle' | 'processing' | 'completed' | 'error';
type WatermarkType = 'text' | 'image';
type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type FontType = 'Helvetica' | 'Times-Roman' | 'Courier';

export default function AddWatermarkClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<WatermarkStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string>('');
  
  // Watermark settings
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [font, setFont] = useState<FontType>('Helvetica');
  const [color, setColor] = useState('#808080');
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>('center');
  const [rotation, setRotation] = useState(45);
  const [scale, setScale] = useState(1.0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      setError('');
      
      const validation = validateWatermarkInput(selectedFile);
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      setStatus('idle');
    }
  }, []);

  const handleImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setImageFile(selectedFile);
      setError('');
    }
  }, []);

  const handleAddWatermark = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (watermarkType === 'text' && !text.trim()) {
      setError('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !imageFile) {
      setError('Please select an image for watermark');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setError('');

    try {
      let imageData: Uint8Array | undefined;
      let imageType: 'jpg' | 'png' | undefined;

      if (watermarkType === 'image' && imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        imageData = new Uint8Array(arrayBuffer);
        imageType = imageFile.type.includes('png') ? 'png' : 'jpg';
      }

      // Convert hex color to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        } : { r: 0.5, g: 0.5, b: 0.5 };
      };

      const watermarkResult = await addWatermarkToPDF(file, {
        type: watermarkType,
        text: watermarkType === 'text' ? text : undefined,
        fontSize,
        font,
        color: hexToRgb(color),
        imageData,
        imageType,
        opacity,
        position,
        rotation,
        scale,
        onProgress: setProgress,
      });

      setResult(watermarkResult);
      setStatus('completed');
    } catch (err) {
      console.error('Watermarking failed:', err);
      setError(err instanceof Error ? err.message : 'Watermarking failed');
      setStatus('error');
    }
  }, [file, watermarkType, text, fontSize, font, color, opacity, position, rotation, scale, imageFile]);

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

  const handleReset = useCallback(() => {
    setFile(null);
    setImageFile(null);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
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
            <div className="bg-yellow-500 p-4 rounded-full">
              <PaintBrushIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add Watermark to PDF
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Add text or image watermarks to your PDF documents. Protect your files and add branding with custom watermarks.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'idle' && (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors duration-200 mb-8"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-yellow-500', 'bg-yellow-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-yellow-500', 'bg-yellow-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-yellow-500', 'bg-yellow-50');
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  if (droppedFiles.length > 0) {
                    const droppedFile = droppedFiles[0];
                    const validation = validateWatermarkInput(droppedFile);
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
                    <PaintBrushIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select PDF File for Watermarking
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a PDF file to add text or image watermarks
                    </p>
                    <button 
                      type="button"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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

              {/* Watermark Type Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Cog6ToothIcon className="w-5 h-5 mr-2" />
                  Watermark Settings
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Watermark Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="watermarkType"
                          value="text"
                          checked={watermarkType === 'text'}
                          onChange={(e) => setWatermarkType(e.target.value as WatermarkType)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Text Watermark</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="watermarkType"
                          value="image"
                          checked={watermarkType === 'image'}
                          onChange={(e) => setWatermarkType(e.target.value as WatermarkType)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Image Watermark</span>
                      </label>
                    </div>
                  </div>

                  {/* Text Watermark Settings */}
                  {watermarkType === 'text' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="Enter watermark text"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Size
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="100"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-500">{fontSize}px</span>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Family
                          </label>
                          <select
                            value={font}
                            onChange={(e) => setFont(e.target.value as FontType)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          >
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times-Roman">Times Roman</option>
                            <option value="Courier">Courier</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                          </label>
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Watermark Settings */}
                  {watermarkType === 'image' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Watermark Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageInputChange}
                          className="hidden"
                          id="image-input"
                        />
                        <label
                          htmlFor="image-input"
                          className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                        >
                          <PhotoIcon className="w-5 h-5 mr-2" />
                          Choose Image
                        </label>
                        {imageFile && (
                          <span className="text-sm text-gray-600">{imageFile.name}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Common Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opacity
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{Math.round(opacity * 100)}%</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as Position)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation
                      </label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{rotation}°</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scale
                      </label>
                      <input
                        type="range"
                        min="0.3"
                        max="2"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{scale}x</span>
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
                  onClick={handleAddWatermark}
                  disabled={!file || (watermarkType === 'text' && !text.trim()) || (watermarkType === 'image' && !imageFile)}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <PaintBrushIcon className="w-5 h-5 mr-2" />
                  Add Watermark
                </button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-500 p-4 rounded-full">
                  <PaintBrushIcon className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Adding Watermark...
              </h3>
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
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
                Watermark Added Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your PDF has been watermarked. Click below to download.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="text-sm text-gray-600">
                  <p><strong>Original:</strong> {(result.originalSize / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Watermarked:</strong> {(result.processedSize / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Pages Processed:</strong> {result.pagesProcessed}</p>
                  <p><strong>Watermark Type:</strong> {watermarkType === 'text' ? `Text: "${text}"` : 'Image'}</p>
                  <p><strong>Position:</strong> {getWatermarkPositionDescription(position)}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Download Watermarked PDF
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Add Another Watermark
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
                Watermarking Failed
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
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h4>
            <p className="text-gray-600">All watermarking happens locally. Your files never leave your device.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2H7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Flexible Options</h4>
            <p className="text-gray-600">Customize text, images, position, opacity, and rotation for perfect watermarks.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Quality</h4>
            <p className="text-gray-600">High-quality watermarks that preserve document integrity and readability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}