import React, { useState, useMemo, useEffect } from 'react';
import type { GeneratedFile, FileTreeNode } from '../types';
import { FileTree } from './FileTree';
import { CodeViewer } from './CodeViewer';

interface GeneratedProjectViewProps {
  files: GeneratedFile[];
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const buildFileTree = (files: GeneratedFile[]): FileTreeNode => {
  const tree: FileTreeNode = {};
  files.forEach(file => {
    const parts = file.path.split('/');
    let currentNode = tree;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        currentNode[part] = { isFile: true, path: file.path };
      } else {
        if (!currentNode[part] || currentNode[part].isFile) {
          currentNode[part] = { isFile: false, children: {} };
        }
        currentNode = currentNode[part].children!;
      }
    });
  });
  return tree;
};

export const GeneratedProjectView: React.FC<GeneratedProjectViewProps> = ({ files, onRegenerate, isRegenerating }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const fileTree = useMemo(() => buildFileTree(files), [files]);

  useEffect(() => {
    // Automatically select the first file when the files change
    if (files.length > 0) {
      // Prioritize build files or main application files for default view
      const preferredFiles = ['pom.xml', 'build.gradle.kts', 'build.gradle'];
      const mainAppFile = files.find(f => f.path.includes('Application.java') || f.path.includes('Main.java'));
      if(mainAppFile) preferredFiles.push(mainAppFile.path);

      let fileToSelect = files[0].path;
      for (const preferred of preferredFiles) {
          const found = files.find(f => f.path.endsWith(preferred));
          if (found) {
              fileToSelect = found.path;
              break;
          }
      }
      setSelectedFilePath(fileToSelect);

    } else {
      setSelectedFilePath(null);
    }
  }, [files]);

  const selectedFile = useMemo(() => {
    return files.find(f => f.path === selectedFilePath) || null;
  }, [files, selectedFilePath]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex justify-end items-center p-2 bg-gray-900 border-b border-gray-700">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-1 px-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm"
        >
          {isRegenerating ? 'Generating...' : 'Generate Again with Same Config'}
        </button>
      </div>
      <div className="flex flex-row flex-grow overflow-hidden">
        <aside className="w-1/3 lg:w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto">
           <div className="p-4 font-mono text-sm border-b border-gray-700 text-gray-400">
              File Explorer
           </div>
          <FileTree tree={fileTree} onFileSelect={setSelectedFilePath} selectedFilePath={selectedFilePath} />
        </aside>
        <main className="w-2/3 lg:w-3/4 flex flex-col">
          {selectedFile ? (
            <CodeViewer file={selectedFile} />
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              <p>Select a file to view its content</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};