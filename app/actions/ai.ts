"use server";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { redis } from "@/lib/redis";
import crypto from "crypto";

const AIResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  emoji: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "nuclear"]),
  tags: z.array(z.string()),
  warning: z.string().optional(),
  steps: z.array(z.object({
    code: z.string(),
    comment: z.string().optional()
  })),
  undoSteps: z.array(z.object({
    code: z.string(),
    comment: z.string().optional()
  })).optional(),
  note: z.string().optional(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

export async function aiResponse(query: string, context?: string): Promise<AIResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  // Create a cache key from the sanitized query and context
  const sanitizedQuery = query.trim().toLowerCase();
  const sanitizedContext = context?.trim().toLowerCase() || "";
  const cacheKey = `git-rescue:v2:${crypto.createHash("md5").update(sanitizedQuery + sanitizedContext).digest("hex")}`;

  try {
    // 1. Try to get from Upstash Redis cache
    const cached = await redis.get<AIResponse>(cacheKey);
    if (cached) {
      console.log("Cache Hit:", sanitizedQuery);
      return cached;
    }

    console.log("Cache Miss, calling AI:", sanitizedQuery);
    const genAI = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const prompt = `
You are an expert Git Rescue Agent. A user is facing a Git problem and needs a clear, structured solution.

User problem:
"${query}"

${context ? `User provided Git Context (e.g., git status/log/error output):
"${context}"
` : ""}

Respond ONLY in a JSON object with the following schema:
{
  "id": "unique-id",
  "slug": "url-friendly-slug",
  "emoji": "relevant-emoji",
  "title": "Clear solution title",
  "description": "Short explanation of what happened",
  "severity": "low" | "medium" | "high" | "nuclear",
  "tags": ["tag1", "tag2"],
  "warning": "CRITICAL WARNING if destructive",
  "steps": [
    { "code": "git command", "comment": "what this does" }
  ],
  "undoSteps": [
    { "code": "git command", "comment": "how to revert the above steps" }
  ],
  "note": "Any additional context"
}

Rules:
1. Use Git 2.23+ syntax (e.g., switch/restore instead of checkout where applicable).
2. Severity Levels:
   - low: Informational or minor fixes.
   - medium: Common workflow issues.
   - high: Potential data loss or tricky merge conflicts.
   - nuclear: Irreversible or dangerous commands (e.g., reset --hard, filter-branch).
3. If the solution is destructive, you MUST include a "warning" and set severity to "nuclear".
4. Limit to maximum 4 steps for the solution and 2-3 steps for the undo steps.
5. Provide a valid JSON object without any markdown formatting blocks.
6. IMPORTANT: If context is provided, use real branch names, commit hashes, or file paths from the context in the commands. If no context, use generic placeholders like <branch-name>.
7. ALWAYS provide "undoSteps" that would safely revert the proposed "steps" to the original state.
`;

    const response = await genAI.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    const text = response.text;

    if (!text) throw new Error("Empty response from AI");

    // Clean JSON response (handle cases where AI wraps it in markdown)
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      const validated = AIResponseSchema.parse(parsed);

      // Save to cache for 24 hours
      await redis.set(cacheKey, validated, { ex: 60 * 60 * 24 });
      
      return validated;
    } catch (err) {
      console.error("Validation or Parse Error:", err, cleaned);
      return null;
    }
  } catch (error) {
    console.error("AI Error or Cache Error:", error);
    return null;
  }
}
