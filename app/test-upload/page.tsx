'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      setFiles(Array.from(droppedFiles));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Multi-File Upload Test</h1>
        
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Multiple PDF Files</h3>
              <p className="text-gray-600 mb-4">
                Hold Ctrl/Cmd and click multiple files, or drag and drop them here
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Choose Files
              </button>
            </div>
          </label>
        </div>

        {/* File List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Selected Files ({files.length})
          </h3>
          
          {files.length === 0 ? (
            <p className="text-gray-500">No files selected</p>
          ) : (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {files.length >= 2 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">
                ✅ Ready to merge {files.length} files!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}