export interface ProjectConfig {
  projectName: string;
  groupId: string;
  artifactId: string;
  javaVersion: '17' | '11' | '8';
  buildTool: 'Maven' | 'Gradle';
  dependencies: string;
  prompt: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export type FileTreeNode = {
    [key: string]: {
        isFile: boolean;
        path?: string;
        children?: FileTreeNode;
    };
};