import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if the key exists to prevent immediate crashes in dev if missing
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const refineMessageWithAI = async (originalText: string, tone: 'professional' | 'casual' | 'flirty' = 'professional'): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return originalText;
  }

  try {
    const prompt = `
      Rewrite the following WhatsApp message to be more ${tone}, polite, and error-free. 
      Keep it concise (under 50 words) as it is a text message.
      Do not add quotation marks.
      
      Message: "${originalText}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || originalText;
  } catch (error) {
    console.error("AI Generation failed:", error);
    return originalText; // Fallback to original
  }
};
