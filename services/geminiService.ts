
import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI right before use to ensure environment variables are fresh
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY not found in environment. Please add it to Vercel/Local settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getPsychiatristResponse = async (message: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are Dr. Philippe Pinel, a compassionate and expert psychiatrist in the city of Mooderia. You provide helpful advice for mental well-being while maintaining a professional yet friendly tone. Keep responses concise and focused on wellness.",
      }
    });
    return { text: response.text || "The metropolis connection is fuzzy. Can you repeat that?" };
  } catch (error) {
    console.error("Psychiatrist API Error:", error);
    return { text: "I'm currently attending to another citizen. Please ensure your Metropolis Link (API Key) is active." };
  }
};

export const getHoroscope = async (sign: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a daily horoscope for ${sign} today.`,
      config: {
        systemInstruction: "You are an expert astrologer. Provide a 3-sentence horoscope that is encouraging and insightful. Use mystical but modern language.",
      }
    });
    return response.text || "The stars are veiled today.";
  } catch (error) {
    return "The constellations are recalibrating. Check back shortly.";
  }
};

export const getLovePrediction = async (sign1: string, sign2: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Predict love compatibility between ${sign1} and ${sign2}. Return only a JSON object with 'percentage' (0-100) and 'reason'.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    percentage: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                },
                required: ['percentage', 'reason']
            }
        }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    return { percentage: 50, reason: "The romantic frequencies are currently experiencing static." };
  }
}

export const checkContentSafety = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following text for inappropriate language, hate speech, severe insults, or harassment: "${text}". Return a JSON object with 'isInappropriate' (boolean) and 'reason' (string, keep it short).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isInappropriate: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ['isInappropriate', 'reason']
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Safety Check Error:", error);
    return { isInappropriate: false, reason: "" }; // Fail open for UX, but log error
  }
};
