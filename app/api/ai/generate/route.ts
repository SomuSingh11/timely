import { getAuthSession } from "@/lib/nextauth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { prompt, mode } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let systemPrompt = "";

    if (mode === "title") {
      systemPrompt = `Generate a short, clear task title (5-8 words maximum).
      Make it action-oriented and specific.
      Do NOT use quotes, colons, or formatting.
      Do NOT be overly formal or verbose.
      Just return the plain title text.
      
      Title: ${prompt}`;
    } else if (mode === "description") {
      systemPrompt = `Write a simple, practical task description.
      Be direct and actionable. Focus on what needs to be done.
      Do NOT be overly formal or verbose.
      Do NOT use phrases like "comprehensive", "clearly defining", "sequential actions".
      Just return the plain description text without quotes or formatting.
      
      Task description: "${prompt}"`;
    }

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text().trim();

    const cleanedText = text.replace(/^["']|["']$/g, "");

    return NextResponse.json({ content: cleanedText });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
