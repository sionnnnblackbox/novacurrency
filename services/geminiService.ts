
import { GoogleGenAI } from "@google/genai";

export async function getCurrencyInsight(from: string, to: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "AI insights currently unavailable.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a very brief (max 30 words), friendly, professional market insight or travel tip for someone converting ${from} to ${to}. Focus on what users should know about this pair right now.`,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text || "Safe travels and smart spending!";
  } catch (error) {
    console.error("Gemini insight error:", error);
    return "Market insights are being refreshed. Check back soon!";
  }
}
