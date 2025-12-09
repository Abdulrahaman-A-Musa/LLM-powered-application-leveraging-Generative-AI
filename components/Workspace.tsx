import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateContentStream } from '../services/geminiService';
import { Action, } from '../types';
import { ACTIONS, ActionId } from '../constants';
import { useAuth } from '../contexts/AuthContext';

import { SparklesIcon } from './icons/SparklesIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { GoogleDriveInput } from './GoogleDriveInput';
import { FileUpload } from './FileUpload';
import { TrashIcon } from './icons/TrashIcon';
import { SaveToDriveIcon } from './icons/SaveToDriveIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
    };
    gapi: any;
  }
}

export const Workspace: React.FC = () => {
  const [sourceContent, setSourceContent] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, isGoogleDriveConfigured } = useAuth();


  const handleGenerate = useCallback(async (action: Action) => {
    if (isLoading || !sourceContent.trim()) return;

    setIsLoading(true);
    setAiResponse('');
    setError('');
    
    const prompt = action.promptBuilder(sourceContent);

    try {
      generateContentStream(prompt, (chunk) => {
        setAiResponse(prev => prev + chunk);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, sourceContent]);

  const handleSaveToDrive = useCallback(async () => {
    if (!isSignedIn || !aiResponse || isSaving) return;

    setIsSaving(true);
    setIsSaved(false);
    setError('');

    try {
        const boundary = '-------314159265358979323846';
        const uniqueFileName = `GIS-ConceptGenius Output - ${new Date().toISOString()}.md`;
        
        const metadata = {
            name: uniqueFileName,
            mimeType: 'text/markdown',
        };

        const multipartRequestBody =
            `--${boundary}\r\n` +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            `\r\n--${boundary}\r\n` +
            'Content-Type: text/markdown\r\n\r\n' +
            aiResponse +
            `\r\n--${boundary}--`;

        const request = window.gapi.client.request({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params: { uploadType: 'multipart' },
            headers: {
                'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartRequestBody
        });
        
        await new Promise((resolve, reject) => request.execute((file, err) => err ? reject(err) : resolve(file)));

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);

    } catch (err: any) {
        console.error("Error saving to Google Drive:", err);
        let errorMessage = 'Failed to save to Google Drive.';
        if (err.result && err.result.error) {
            errorMessage += ` Reason: ${err.result.error.message}`;
        }
        setError(errorMessage);
    } finally {
        setIsSaving(false);
    }
}, [isSignedIn, aiResponse, isSaving]);


  const handleDownload = () => {
    if (aiResponse) {
      const blob = new Blob([aiResponse], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GIS-ConceptGenius_output.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  const handleContentImport = useCallback((newContent: string) => {
    setSourceContent(prev => (prev ? `${prev}\n\n${newContent}` : newContent).trim());
    setError(''); // Clear previous errors on successful import
  }, []);


  const handleClearSource = () => {
    setSourceContent('');
    setError('');
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.innerHTML = window.marked.parse(aiResponse);
    }
  }, [aiResponse]);
  
  const InputPanel = () => (
    <div className="flex flex-col bg-white dark:bg-gray-800 p-4 lg:p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Source Document</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Type, paste, or import content to transform.</p>
        </div>
        {sourceContent && (
             <button 
                onClick={handleClearSource}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Clear source content"
            >
                <TrashIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
        )}
      </div>

       <div className="flex-grow flex flex-col">
          <textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Type or paste your raw notes, ideas, or document outlines here..."
              className="flex-grow w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows={15}
          />
       </div>
       
       <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
         <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Import Content</h4>
         <div className="flex flex-col sm:flex-row gap-4">
            <FileUpload onContentLoaded={handleContentImport} onSetError={setError} />
            <div className="flex items-center sm:flex-col">
                <hr className="w-full border-t border-gray-300 dark:border-gray-600 sm:w-px sm:h-full"/>
                <span className="mx-4 text-xs font-medium text-gray-500 sm:my-2">OR</span>
                <hr className="w-full border-t border-gray-300 dark:border-gray-600 sm:w-px sm:h-full"/>
            </div>
            <GoogleDriveInput onContentLoaded={handleContentImport} onSetError={setError} />
         </div>
       </div>
      
      {error && (
        <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-md" role="alert">
          {error}
        </div>
      )}

      {sourceContent && (
        <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Choose an Action</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACTIONS.map(action => (
                    <button
                        key={action.id}
                        onClick={() => handleGenerate(action)}
                        disabled={isLoading}
                        className="w-full text-left p-3 border border-transparent rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-start space-x-3 dark:focus:ring-offset-gray-800"
                    >
                        <action.Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-sm">{action.name}</p>
                            <p className="text-xs text-blue-100">{action.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );

  const OutputPanel = () => (
     <div className="flex flex-col bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Generated Output</h3>
            {isSaved && <span className="text-sm text-green-600 dark:text-green-400">Saved to Drive!</span>}
          </div>
          <div className="flex items-center space-x-2">
              <button onClick={handleDownload} disabled={!aiResponse || isLoading} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Download as Markdown">
                <DownloadIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button 
                onClick={handleSaveToDrive} 
                disabled={!isGoogleDriveConfigured || !isSignedIn || !aiResponse || isLoading || isSaving} 
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                title={
                    !isGoogleDriveConfigured ? "Google Drive integration is not configured" :
                    !isSignedIn ? "Connect to Google Drive to save" : 
                    "Save to Google Drive"
                }
              >
                  {isSaving ? <SpinnerIcon className="w-5 h-5 text-blue-500" /> : isSaved ? <CheckIcon className="w-5 h-5 text-green-500" /> : <SaveToDriveIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
              </button>
          </div>
        </div>
        <div className="flex-grow">
            {isLoading && !aiResponse && (
                 <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <SparklesIcon className="w-10 h-10 mx-auto animate-pulse text-blue-500" />
                        <p className="mt-2">Generating content...</p>
                    </div>
                 </div>
            )}
            <div 
                ref={outputRef}
                className="prose prose-sm dark:prose-invert max-w-none p-6 lg:p-8"
            >
                {!aiResponse && !isLoading && (
                    <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
                        The generated document will appear here once you provide source content and select an action.
                    </div>
                )}
            </div>
        </div>
    </div>
  );


  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px overflow-hidden bg-gray-200 dark:bg-gray-700">
        <InputPanel />
        <OutputPanel />
    </div>
  );
};