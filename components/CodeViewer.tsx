
import React, { useState, useCallback } from 'react';
import type { GeneratedFile } from '../types';

interface CodeViewerProps {
  file: GeneratedFile;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(file.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [file.content]);

  return (
    <div className="bg-gray-900 flex-grow flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700">
        <p className="font-mono text-sm text-gray-400">{file.path}</p>
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold py-1 px-3 rounded-md transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
          <code className="text-gray-200">{file.content}</code>
        </pre>
      </div>
    </div>
  );
};
