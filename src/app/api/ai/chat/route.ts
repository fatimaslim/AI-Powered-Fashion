import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
You are StyleMind AI, an expert, professional, and friendly virtual fashion stylist. 
Your goal is to provide exceptional fashion advice, outfit recommendations, styling tips, color theory guidance, and help with modest/hijab fashion.
You are embedded in the StyleMind AI application, which also features an AI Virtual Try-On tool for clothing and hijabs.

Guidelines for your responses:
1. Be encouraging, warm, and highly knowledgeable about fashion.
2. Use markdown formatting to make your responses easy to read (bolding key terms, using bullet points).
3. If someone asks about the Virtual Try-On, encourage them to use the feature on the website to see how clothes look on them.
4. Keep your advice practical, modern, and stylish.
5. If someone asks something completely unrelated to fashion, politely redirect them back to styling and fashion topics.
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to demo mode if no API key is provided
      console.warn("GEMINI_API_KEY is missing. Falling back to demo chat mode.");
      return NextResponse.json({
        role: "assistant",
        content: "Hello! I am StyleMind AI's demo stylist. To enable my full Gemini AI brain, please add your GEMINI_API_KEY to the environment variables!",
      });
    }

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey });

    // Format history for Gemini
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    return NextResponse.json({
      role: "assistant",
      content: response.text,
    });

  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
