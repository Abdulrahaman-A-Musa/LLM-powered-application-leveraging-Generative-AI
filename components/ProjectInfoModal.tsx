
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 relative animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          <LogoIcon className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Overview</h2>
        </div>

        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 uppercase text-xs tracking-wider">Strategic Value</h3>
            <p className="text-sm md:text-base">
              Leveraging Generative AI to automate and elevate the critical administrative phase of the GIS project lifecycle. By intelligently transforming raw technical notes into structured professional documents, it addresses the common bottleneck where highly skilled GIS experts spend disproportionate time on drafting rather than execution.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 uppercase text-xs tracking-wider">Operational Functionality</h3>
            <p className="mb-3">The app allows you to upload your summary note and automates the following:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <li className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Concept Notes</span>
                </li>
                <li className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Project Proposals</span>
                </li>
                <li className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Innovations</span>
                </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
