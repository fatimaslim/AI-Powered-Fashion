import { NextResponse } from "next/server";
import Groq from "groq-sdk";

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

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Fallback to demo mode if no API key is provided
      console.warn("GROQ_API_KEY is missing. Falling back to demo chat mode.");
      return NextResponse.json({
        role: "assistant",
        content: "Hello! I am StyleMind AI's demo stylist. To enable my full Groq AI brain, please add your GROQ_API_KEY to the environment variables!",
      });
    }

    // Initialize Groq SDK
    const groq = new Groq({ apiKey });

    // Insert System Prompt at the beginning of the messages
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }))
    ];

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama3-70b-8192", // Fast, highly intelligent model
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      role: "assistant",
      content: chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.",
    });

  } catch (error: any) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: `Groq Error: ${error.message || "Failed to generate AI response"}` },
      { status: 500 }
    );
  }
}
