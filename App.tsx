
// FIX: Removed an unused import of GisIcon. It was causing a module resolution error because the target file 'components/icons/GisIcon.tsx' is empty.
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './contexts/AuthContext';
import { Workspace } from './components/Workspace';
import { ProjectInfoModal } from './components/ProjectInfoModal';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <AuthProvider>
      <div className={`flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
        <Sidebar 
          theme={theme}
          toggleTheme={toggleTheme}
          onShowInfo={() => setIsInfoOpen(true)}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Workspace />
        </main>
        <ProjectInfoModal 
          isOpen={isInfoOpen} 
          onClose={() => setIsInfoOpen(false)} 
        />
      </div>
    </AuthProvider>
  );
}
