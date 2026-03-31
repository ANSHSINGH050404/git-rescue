"use server";

import { GoogleGenAI } from "@google/genai";

type AIResponse = {
  id: string;
  slug: string;
  emoji: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "nuclear";
  tags: string[];
  warning?: string;
  steps: { code: string; comment?: string }[];
  note?: string;
};

export async function aiResponse(query: string): Promise<AIResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY; // ✅ NOT public
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenAI({ apiKey });

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const prompt = `
You are the Git Rescue Agent.

User problem:
"${query}"

Respond ONLY in JSON format.

Rules:
- Use Git 2.23+ syntax
- Severity: low | medium | high | nuclear
- Destructive → nuclear + warning
- Max 4 steps
`;

    const result = await genAI.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");

    // ✅ Strong JSON cleaning
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error:", cleaned);
      return null;
    }
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}