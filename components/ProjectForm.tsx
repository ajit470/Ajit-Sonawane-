import React, { useState } from 'react';
import type { ProjectConfig } from '../types';

interface ProjectFormProps {
  onSubmit: (config: ProjectConfig) => void;
  isLoading: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, isLoading }) => {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: 'my-awesome-project',
    groupId: 'com.example',
    artifactId: 'demo',
    javaVersion: '17',
    buildTool: 'Maven',
    dependencies: 'Lombok, Spring Boot DevTools',
    prompt: 'A simple Spring Boot application with a REST endpoint at /hello that returns "Hello, World!". Include JUnit 5 for testing.',
  });

  const handleChange = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,>(
    e: React.ChangeEvent<T>
  ) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };
  
  const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl h-full">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Project Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="prompt" className={labelClass}>Project Prompt</label>
          <textarea id="prompt" name="prompt" value={config.prompt} onChange={handleChange} rows={6} className={inputClass} placeholder="Describe the application you want to build. The AI will infer dependencies and structure from this." required></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectName" className={labelClass}>Project Name</label>
              <input type="text" id="projectName" name="projectName" value={config.projectName} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="artifactId" className={labelClass}>Artifact ID</label>
              <input type="text" id="artifactId" name="artifactId" value={config.artifactId} onChange={handleChange} className={inputClass} required />
            </div>
        </div>

        <div>
            <label htmlFor="groupId" className={labelClass}>Group ID</label>
            <input type="text" id="groupId" name="groupId" value={config.groupId} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label htmlFor="dependencies" className={labelClass}>Additional Dependencies (Optional)</label>
          <textarea id="dependencies" name="dependencies" value={config.dependencies} onChange={handleChange} rows={2} className={inputClass} placeholder="e.g., Lombok, MapStruct. The AI will also infer dependencies from the prompt."></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="javaVersion" className={labelClass}>Java Version</label>
                <select id="javaVersion" name="javaVersion" value={config.javaVersion} onChange={handleChange} className={inputClass}>
                    <option value="17">17</option>
                    <option value="11">11</option>
                    <option value="8">8</option>
                </select>
            </div>
            <div>
                <label className={labelClass}>Build Tool</label>
                <div className="flex space-x-4 mt-2">
                    {['Maven', 'Gradle'].map(tool => (
                    <label key={tool} className="flex items-center space-x-2 cursor-pointer">
                        <input
                        type="radio"
                        name="buildTool"
                        value={tool}
                        checked={config.buildTool === tool}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                        />
                        <span className="text-gray-200">{tool}</span>
                    </label>
                    ))}
                </div>
            </div>
        </div>
        
        <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
          {isLoading ? 'Generating...' : 'Generate Project'}
        </button>
      </form>
    </div>
  );
};