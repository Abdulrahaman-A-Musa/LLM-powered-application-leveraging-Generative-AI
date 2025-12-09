import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI functionality will be disabled.");
}

// FIX: Prevent app crash on startup if API_KEY is not set.
// The `ai` instance is now initialized only if the API_KEY is available.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateContentStream = async (prompt: string, onChunk: (chunk: string) => void) => {
  // FIX: Check if the 'ai' instance was successfully initialized instead of just the API key.
  if (!ai) {
    const errorMessage = "Error: Gemini API key is not configured. Please set the API_KEY environment variable.";
    onChunk(errorMessage);
    return;
  }
  
  try {
    const responseStream = await ai.models.generateContentStream({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         thinkingConfig: { thinkingBudget: 0 }
       }
    });

    for await (const chunk of responseStream) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Error generating content:", error);
    const errorMessage = `Error from Gemini API: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`;
    onChunk(errorMessage);
  }
};
