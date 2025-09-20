
import React from 'react';
import type { FileTreeNode } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';

interface FileTreeProps {
  tree: FileTreeNode;
  onFileSelect: (path: string) => void;
  selectedFilePath: string | null;
  level?: number;
}

const TreeEntry: React.FC<{
    name: string;
    node: { isFile: boolean; path?: string; children?: FileTreeNode };
    onFileSelect: (path: string) => void;
    selectedFilePath: string | null;
    level: number;
}> = ({ name, node, onFileSelect, selectedFilePath, level }) => {
    const isSelected = node.isFile && node.path === selectedFilePath;
    const indentStyle = { paddingLeft: `${level * 1.5}rem` };

    if (node.isFile) {
        return (
            <div
                onClick={() => onFileSelect(node.path!)}
                className={`flex items-center space-x-2 py-1.5 px-4 cursor-pointer text-gray-300 hover:bg-cyan-900/50 ${isSelected ? 'bg-cyan-800/60' : ''}`}
                style={indentStyle}
            >
                <FileIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{name}</span>
            </div>
        );
    }

    // Sort children so folders appear before files
    const sortedChildren = Object.entries(node.children || {}).sort(([, a], [, b]) => {
        if (a.isFile && !b.isFile) return 1;
        if (!a.isFile && b.isFile) return -1;
        return 0;
    });

    return (
        <div>
            <div className="flex items-center space-x-2 py-1.5 px-4 text-gray-300" style={indentStyle}>
                <FolderIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{name}</span>
            </div>
            {sortedChildren.map(([childName, childNode]) => (
                <TreeEntry
                    key={childName}
                    name={childName}
                    node={childNode}
                    onFileSelect={onFileSelect}
                    selectedFilePath={selectedFilePath}
                    level={level + 1}
                />
            ))}
        </div>
    );
};

export const FileTree: React.FC<FileTreeProps> = ({ tree, onFileSelect, selectedFilePath, level = 0 }) => {
    const sortedRoot = Object.entries(tree).sort(([, a], [, b]) => {
        if (a.isFile && !b.isFile) return 1;
        if (!a.isFile && b.isFile) return -1;
        return 0;
    });

    return (
        <div className="font-mono text-sm py-2">
            {sortedRoot.map(([name, node]) => (
                <TreeEntry
                    key={name}
                    name={name}
                    node={node}
                    onFileSelect={onFileSelect}
                    selectedFilePath={selectedFilePath}
                    level={level}
                />
            ))}
        </div>
    );
};
