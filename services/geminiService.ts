import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
}

export const generatePhoneMessage = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "Hello? Hello? Uh, I wanted to record a message for you to help you get settled in on your first night. There's nothing to worry about!";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are the "Phone Guy" in a Five Nights at Freddy's style game. 
      Write a short, slightly nervous, and creepy voicemail (max 40 words) for the night security guard starting their shift. 
      Hint at the animatronics moving but try to downplay it casually.
      Do not use emojis.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Connection lost...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "static... (The phone line seems dead)";
  }
};
