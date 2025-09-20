import { GoogleGenAI, Type } from "@google/genai";
import type { ProjectConfig, GeneratedFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        description: 'The full relative path of the file, including directories. E.g., "src/main/java/com/example/App.java".',
      },
      content: {
        type: Type.STRING,
        description: 'The complete source code or text content of the file.',
      },
    },
    required: ['path', 'content'],
  },
};

function buildPrompt(config: ProjectConfig): string {
  return `
    Generate a complete Java project structure and source code based on the following prompt and configuration.
    The primary source of requirements is the Project Prompt. Use it to determine the application's logic, features, and dependencies.

    ---
    Project Prompt:
    ${config.prompt}
    ---

    Project Configuration:
    - Project Name: ${config.projectName}
    - Build Tool: ${config.buildTool}
    - Java Version: ${config.javaVersion}
    - Group ID: ${config.groupId}
    - Artifact ID: ${config.artifactId}
    - Additional Dependencies: ${config.dependencies || 'None'}

    Instructions:
    1. Analyze the Project Prompt to understand the core functionality.
    2. Infer any required dependencies from the prompt (e.g., if it mentions a REST API, include Spring Boot Web). Add these to any dependencies listed in "Additional Dependencies".
    3. Generate the build file (${config.buildTool === 'Maven' ? 'pom.xml' : 'build.gradle.kts'}), configured with the specified Java version, group/artifact IDs, and all determined dependencies.
    4. Create the main Java class and any other necessary classes in the correct package structure (e.g., 'src/main/java/${config.groupId.replace(/\./g, '/')}/${config.artifactId.replace(/-/g,'')}/MainApplication.java'). The code should implement the logic described in the Project Prompt.
    5. Include a basic .gitignore file suitable for a Java project.
    6. If testing frameworks like JUnit are needed, include a basic test class in 'src/test/java/...'.
    7. If Spring Boot is required, ensure the main class is a proper Spring Boot application class.

    The entire output must be a single, valid JSON array of file objects, conforming to the provided schema.
    `;
}


export const generateJavaProject = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
    try {
        const prompt = buildPrompt(config);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
                systemInstruction: "You are an expert Java project generator. Your task is to generate a complete file structure and source code for a Java project based on user specifications. You must provide the output as a single, valid JSON object that strictly adheres to the provided schema. The JSON object must be an array of file objects, where each file object has a 'path' and 'content' property. Do not include any explanations, markdown formatting, or conversational text outside of the JSON structure.",
            },
        });

        const jsonString = response.text.trim();
        const generatedFiles = JSON.parse(jsonString) as GeneratedFile[];

        if (!Array.isArray(generatedFiles) || generatedFiles.some(f => typeof f.path !== 'string' || typeof f.content !== 'string')) {
            throw new Error("AI returned data in an invalid format.");
        }

        return generatedFiles;
    } catch (error) {
        console.error("Error generating Java project:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the AI's response. The format was invalid JSON.");
        }
        throw new Error("An error occurred while communicating with the Gemini API.");
    }
};