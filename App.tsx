import React, { useState, useCallback } from 'react';
import type { ProjectConfig, GeneratedFile } from './types';
import { Header } from './components/Header';
import { ProjectForm } from './components/ProjectForm';
import { GeneratedProjectView } from './components/GeneratedProjectView';
import { Loader } from './components/Loader';
import { generateJavaProject } from './services/geminiService';

const App: React.FC = () => {
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastConfig, setLastConfig] = useState<ProjectConfig | null>(null);

  const handleGenerateProject = useCallback(async (config: ProjectConfig) => {
    setIsLoading(true);
    setError(null);
    setGeneratedFiles(null);
    try {
      const files = await generateJavaProject(config);
      setGeneratedFiles(files);
      setLastConfig(config); // Store config on success
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (lastConfig) {
      handleGenerateProject(lastConfig);
    }
  }, [lastConfig, handleGenerateProject]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <ProjectForm onSubmit={handleGenerateProject} isLoading={isLoading} />
        </div>
        <div className="md:w-2/3 lg:w-3/4 flex-grow flex flex-col bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
              <Loader />
              <p className="mt-4 text-lg text-gray-400 animate-pulse">
                Generating your Java project... this may take a moment.
              </p>
            </div>
          )}
          {error && (
            <div className="flex-grow flex items-center justify-center p-8">
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-lg max-w-md text-center">
                <h3 className="font-bold text-xl mb-2">Generation Failed</h3>
                <p>{error}</p>
              </div>
            </div>
          )}
          {!isLoading && !error && !generatedFiles && (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082a.75.75 0 01.75.75v5.714a2.25 2.25 0 00.659 1.591L14.25 14.5M9.75 3.104a6.375 6.375 0 00-4.065 2.553m4.065-2.553a6.375 6.375 0 014.065 2.553m-4.065-2.553v0c.162.022.324.047.487.074m-4.832 2.479A6.375 6.375 0 009 2.25m-2.25 3.852A6.375 6.375 0 019 2.25m2.25 3.852A6.375 6.375 0 009 2.25M9 21.75c2.836 0 5.14-2.304 5.14-5.14s-2.304-5.14-5.14-5.14-5.14 2.304-5.14 5.14 2.304 5.14 5.14 5.14z" />
              </svg>
              <h2 className="mt-4 text-2xl font-bold text-gray-400">Welcome to the AI Java Project Generator</h2>
              <p className="mt-2 text-gray-500">Fill out the form on the left to get started.</p>
            </div>
          )}
          {generatedFiles && (
            <GeneratedProjectView 
              files={generatedFiles} 
              onRegenerate={handleRegenerate}
              isRegenerating={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;