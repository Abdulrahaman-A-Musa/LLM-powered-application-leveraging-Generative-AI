import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { extractFolderIdFromUrl, fetchDriveFolderContents } from '../services/googleDriveService';
import { LinkIcon } from './icons/LinkIcon';

interface GoogleDriveInputProps {
  onContentLoaded: (content: string) => void;
  onSetError: (error: string) => void;
}

export const GoogleDriveInput: React.FC<GoogleDriveInputProps> = ({ onContentLoaded, onSetError }) => {
  const { isSignedIn, isGoogleDriveConfigured } = useAuth();
  const [folderUrl, setFolderUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async () => {
    onSetError('');
    const folderId = extractFolderIdFromUrl(folderUrl);
    if (!folderId) {
      onSetError('Invalid Google Drive folder URL. Please provide a valid link.');
      return;
    }

    setIsLoading(true);
    try {
      const content = await fetchDriveFolderContents(folderId);
      onContentLoaded(content);
      setFolderUrl('');
    } catch (error: any) {
      console.error("Google Drive fetch error:", error);
      let errorMessage = 'An unknown error occurred while fetching from Google Drive.';
      if (error?.result?.error?.message) {
        // GAPI specific error
        errorMessage = `Google Drive API Error: ${error.result.error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      onSetError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isInputDisabled = !isGoogleDriveConfigured || !isSignedIn || isLoading;

  return (
    <div className="flex-1">
      <div className="flex space-x-2">
        <input
          id="driveUrl"
          type="url"
          value={folderUrl}
          onChange={(e) => setFolderUrl(e.target.value)}
          placeholder="Paste Google Drive folder link..."
          className="flex-grow w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isInputDisabled}
          aria-label="Google Drive folder URL"
        />
        <button
          onClick={handleFetch}
          disabled={isInputDisabled || !folderUrl.trim()}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
          aria-label="Fetch content from Google Drive"
        >
          {isLoading ? '...' : <LinkIcon className="w-5 h-5" />}
        </button>
      </div>
       {!isGoogleDriveConfigured ? (
         <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            Google Drive integration is not configured.
         </p>
      ) : !isSignedIn && (
        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          Connect to Google Drive in the sidebar to enable.
        </p>
      )}
    </div>
  );
};