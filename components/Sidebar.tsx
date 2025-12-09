
import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { useAuth } from '../contexts/AuthContext';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon';
import { LogoIcon } from './icons/LogoIcon';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SaveToDriveIcon } from './icons/SaveToDriveIcon';
import { InfoIcon } from './icons/InfoIcon';

interface SidebarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onShowInfo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ theme, toggleTheme, onShowInfo }) => {
  const { isSignedIn, signIn, signOut, isInitialized, isGoogleDriveConfigured } = useAuth();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <LogoIcon className="w-7 h-7 text-blue-500 flex-shrink-0" />
        <h1 className="text-lg font-bold text-gray-800 dark:text-white truncate">GIS-ConceptGenius</h1>
      </div>
      <div className="flex-1 p-4">
        <p className="px-2 text-sm text-gray-600 dark:text-gray-400">
          Your AI assistant for project documents.
        </p>

        <div className="mt-6 px-2 space-y-5">
            <div className="flex items-start space-x-3">
                <UploadIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Import & Edit</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload, paste text, or connect Google Drive.</p>
                </div>
            </div>
            <div className="flex items-start space-x-3">
                <SparklesIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Transform & Create</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generate notes, proposals, and ideas.</p>
                </div>
            </div>
            <div className="flex items-start space-x-3">
                <SaveToDriveIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Save & Export</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Download or save directly to Google Drive.</p>
                </div>
            </div>
        </div>

      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {isGoogleDriveConfigured ? (
            isInitialized && (
                <button
                    onClick={isSignedIn ? signOut : signIn}
                    disabled={!isInitialized}
                    className="w-full flex items-center justify-center p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
                    aria-label={isSignedIn ? "Disconnect Google Drive" : "Connect Google Drive"}
                >
                    <GoogleDriveIcon className={`w-6 h-6 ${isSignedIn ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'}`} />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {isSignedIn ? 'Drive Connected' : 'Connect Drive'}
                    </span>
                </button>
            )
        ) : (
             <div className="p-2 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-center" role="alert">
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                    Google Drive integration is not configured.
                </p>
            </div>
        )}
        
        <button 
            onClick={onShowInfo}
            className="w-full flex items-center justify-center p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 group"
            aria-label="Project Information"
        >
          <InfoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
          <span className="ml-2 text-sm font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">
            About Project
          </span>
        </button>

        <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-center p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle theme"
        >
          {theme === 'light' ? 
            <MoonIcon className="w-6 h-6 text-gray-700" /> : 
            <SunIcon className="w-6 h-6 text-yellow-400" />
          }
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
};
