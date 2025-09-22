'use client';

import { useCallback, useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { validateFiles, formatFileSize } from '@/lib/utils/file-validation';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes: string[];
  maxFiles?: number;
  maxFileSize?: number;
  multiple?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export default function FileUploader({
  onFilesSelected,
  acceptedTypes,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  title = 'Upload Files',
  description = 'Drag and drop files here or click to browse',
  className = '',
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setError('');

    // Validate files
    const validation = validateFiles(fileArray, acceptedTypes, maxFiles, maxFileSize);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid files');
      return;
    }

    onFilesSelected(fileArray);
  }, [onFilesSelected, acceptedTypes, maxFiles, maxFileSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getAcceptString = useCallback(() => {
    return acceptedTypes.join(',');
  }, [acceptedTypes]);

  const getFileTypeDescription = useCallback(() => {
    if (acceptedTypes.includes('application/pdf')) {
      return 'PDF files';
    }
    if (acceptedTypes.some(type => type.startsWith('image/'))) {
      return 'Image files';
    }
    return 'Supported files';
  }, [acceptedTypes]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`upload-zone cursor-pointer ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 text-center">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <DocumentIcon className="w-4 h-4 mr-1" />
              {getFileTypeDescription()}
            </div>
            <div>
              Max size: {formatFileSize(maxFileSize)}
            </div>
            {multiple && (
              <div>
                Max files: {maxFiles}
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="mt-4 btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Choose Files
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}