import React, { useState, useCallback } from 'react';
import { readFileAsText } from '../services/fileService';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onContentLoaded: (content: string) => void;
  onSetError: (error: string) => void;
}

const ALLOWED_MIME_TYPES = ['text/plain', 'text/markdown'];
const MAX_FILE_SIZE_MB = 5;

export const FileUpload: React.FC<FileUploadProps> = ({ onContentLoaded, onSetError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File | null) => {
    onSetError('');
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      onSetError(`Invalid file type. Please upload a .txt or .md file.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      onSetError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    try {
      const textContent = await readFileAsText(file);
      onContentLoaded(`--- START OF FILE: ${file.name} ---\n\n${textContent}\n\n--- END OF FILE: ${file.name} ---`);
    } catch (error) {
      console.error(error);
      onSetError('Failed to read the uploaded file.');
    }
  }, [onContentLoaded, onSetError]);

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex-1">
      <label
        htmlFor="file-upload"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
      >
        <UploadIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Click to upload or drag & drop
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          .txt or .md (Max {MAX_FILE_SIZE_MB}MB)
        </span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept=".txt,.md,text/plain,text/markdown"
          onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
        />
      </label>
    </div>
  );
};
