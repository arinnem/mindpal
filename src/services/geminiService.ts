import { 
  GoogleGenerativeAI, 
  Content,
  ChatSession,
  GenerationConfig,
  SafetySetting,
  Part
} from '@google/generative-ai';
import { DEFAULT_GEMINI_TEXT_MODEL, DEFAULT_GEMINI_IMAGE_MODEL } from '@/lib/constants';
import { GroundingChunk } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will not work. Please set the NEXT_PUBLIC_GEMINI_API_KEY environment variable.");
}

const ai = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const parseJsonFromText = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("Failed to parse JSON from text:", error, "Original text:", text);
    return null;
  }
};

export async function generateGeminiText(prompt: string) {
  if (!API_KEY) return "API Key not configured. AI service unavailable.";
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text(); 
  return text;
}

export const geminiService = {
  generateText: async (
    prompt: string, 
    systemInstruction?: string, 
    useGoogleSearch: boolean = false
  ): Promise<{text: string, groundingChunks?: GroundingChunk[]}> => {
    if (!ai) return { text:"API Key not configured. AI service unavailable."};
    try {
      // Create a content array with the prompt
      const parts: Part[] = [{ text: prompt }];
      
      // Get the model with generation config
      const generationConfig: GenerationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      };
      
      // Create the model
      const model = ai.getGenerativeModel({ 
        model: DEFAULT_GEMINI_TEXT_MODEL,
        generationConfig
      });
      
      // Generate content with system instruction if provided
      const generateContentRequest: any = { parts };
      
      if (systemInstruction) {
        // Apply system instruction as a prefix to the prompt
        generateContentRequest.parts = [
          { text: `System: ${systemInstruction}\n\nUser: ${prompt}` }
        ];
      }
      
      // Add Google Search if needed
      if (useGoogleSearch) {
        // Use the Google Search tool if available
        // Note: This might need adjustment based on the exact API version
        generateContentRequest.generationConfig = {
          ...generationConfig,
          tools: [{ googleSearch: {} }]
        };
      }
      
      // Generate content
      const result = await model.generateContent(generateContentRequest);
      const response = await result.response;
      const text = response.text();
      
      // Extract grounding chunks if available (with type assertion)
      let groundingChunks: GroundingChunk[] | undefined;
      try {
        // Access the response data structure carefully
        const responseData = response as any;
        if (responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
          groundingChunks = responseData.candidates?.[0]?.groundingChunks as GroundingChunk[] | undefined;
        }
      } catch (e) {
        console.warn("Could not extract grounding chunks:", e);
      }
      
      return { text, groundingChunks };
    } catch (error) {
      console.error("Error generating text:", error);
      return {text: "Xin lỗi, tớ đang gặp chút trục trặc và chưa thể trả lời lúc này."};
    }
  },

  generateTextWithJsonOutput: async <T,>(
    prompt: string, 
    systemInstruction?: string
  ): Promise<T | null> => {
    if (!ai) {
      console.error("API Key not configured. AI service unavailable.");
      return null;
    }
    try {
      // Create parts with the prompt
      const parts: Part[] = [{ text: prompt }];
      
      // Get the model with JSON configuration
      const model = ai.getGenerativeModel({ 
        model: DEFAULT_GEMINI_TEXT_MODEL,
        generationConfig: {
          temperature: 0.2, // Lower temperature for more deterministic JSON output
        }
      });
      
      // Generate content with system instruction if provided
      let generateRequest: any = { parts };
      
      if (systemInstruction) {
        // Apply system instruction as a prefix to the prompt
        generateRequest = { 
          parts: [{ text: `System: ${systemInstruction}\n\nUser: ${prompt}` }]
        };
      }
      
      // Add a hint to return JSON
      generateRequest.parts[0].text += "\n\nPlease respond with valid JSON only.";
      
      // Generate content
      const result = await model.generateContent(generateRequest);
      const response = await result.response;
      const text = response.text();
      
      return parseJsonFromText<T>(text);
    } catch (error) {
      console.error("Error generating JSON:", error);
      return null;
    }
  },

  startChatSession: async (systemInstruction?: string, history?: Content[]): Promise<ChatSession | null> => {
    if (!ai) return null;
    try {
      const model = ai.getGenerativeModel({ model: DEFAULT_GEMINI_TEXT_MODEL });
      
      const chatSessionConfig: any = {};
      
      if (systemInstruction) {
        chatSessionConfig.systemInstruction = systemInstruction;
      }
      if (history) {
        chatSessionConfig.history = history;
      }
      
      return model.startChat(chatSessionConfig);
    } catch (error) {
      console.error("Error starting chat session:", error);
      return null;
    }
  },
  
  generateImage: async (prompt: string): Promise<string | null> => {
    if (!ai) return null;
    try {
      // For image generation, we need to use a different approach
      // The Imagen model requires a different API call
      const model = ai.getGenerativeModel({ model: DEFAULT_GEMINI_IMAGE_MODEL });
      
      // Use the prompt directly as a string
      const result = await model.generateContent(prompt);
      
      const response = await result.response;
      
      // Try to extract the image data from the response
      try {
        const responseData = response as any;
        const imageData = responseData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (imageData) {
          return `data:image/png;base64,${imageData}`;
        }
      } catch (e) {
        console.error("Error extracting image data:", e);
      }
      
      return null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  },
};