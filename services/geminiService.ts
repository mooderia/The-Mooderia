
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Upgraded to gemini-3-pro-preview for complex reasoning tasks (Psychiatry advice)
export const getPsychiatristResponse = async (message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: "You are Dr. Philippe Pinel, a compassionate and expert psychiatrist in the city of Mooderia. You provide helpful advice for mental well-being while maintaining a professional yet friendly tone. You were formerly known as Dr. Mood.",
    }
  });
  return response.text;
};

// Fix: Upgraded to gemini-3-pro-preview for complex reasoning tasks (Nutritional science)
export const getNutritionistResponse = async (message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: "You are Dr. Antoine Lavoisier, a professional nutritionist in Mooderia. You guide users on meal plans and wellness. You were formerly known as Dr. Health.",
    }
  });
  return response.text;
};

// Fix: Upgraded to gemini-3-pro-preview for complex reasoning tasks (Educational guidance)
export const getStudyGuideResponse = async (message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: "You are Sir Clark (formerly known as Sir Ron Clark), an inspiring and energetic educator in Mooderia. You help students with study methods, provide words of wisdom, and assist with assignments by explaining concepts clearly and motivating them to achieve excellence.",
    }
  });
  return response.text;
};

export const getTellerResponse = async (question: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Predict the answer to this question in a mystical way: ${question}`,
    config: {
      systemInstruction: "You are a mystical fortune teller. Your answers are short, poetic, and slightly mysterious.",
    }
  });
  return response.text;
};

export const getHoroscope = async (sign: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a daily horoscope for ${sign} today.`,
    config: {
      systemInstruction: "You are an expert astrologer. Provide a 3-sentence horoscope that is encouraging and insightful.",
    }
  });
  return response.text;
};

export const getPlanetaryInsights = async (sign: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain how current planetary movements affect the mood of a ${sign} today. Include one specific planet in transit.`,
    config: {
      systemInstruction: "You are a cosmic astrologer providing deep, personalized insights based on planetary aspects. CRITICAL: Do not use any Markdown symbols like asterisks (*), hashtags (#), or dashes (-) for formatting. Provide the response as plain, natural text organized into multiple clear paragraphs. Do not return a single long line of text.",
    }
  });
  return response.text;
};

// Fix: Improved JSON parsing with safety checks and trim() for more robust response handling
export const getLovePrediction = async (sign1: string, sign2: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Predict love compatibility between ${sign1} and ${sign2}. Return only a JSON object with 'percentage' (0-100) and 'reason' (detailed multi-sentence explanation).`,
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
    
    const text = response.text;
    if (!text) {
        throw new Error("No response text received from the model.");
    }
    return JSON.parse(text.trim());
}
