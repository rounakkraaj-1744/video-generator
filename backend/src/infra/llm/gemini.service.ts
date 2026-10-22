import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function getStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;

  const e = error as {
    status?: number;
    statusCode?: number;
    code?: number | string;
    message?: string;
  };

  const status = e.status ?? e.statusCode ?? e.code;

  if (typeof status === "number") return status;

  const match = e.message?.match(/\b(429|500|502|503|504)\b/);
  return match ? Number(match[1]) : undefined;
}

function isRetryable(error: unknown): boolean {
  const status = getStatus(error);
  return status !== undefined &&
    [408, 429, 500, 502, 503, 504].includes(status);
}

export class GeminiService {
  private readonly client: GoogleGenAI;

  private readonly primaryModel =
    process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

  private readonly fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.7-flash";

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.client = new GoogleGenAI({ apiKey });
  }

  async generateVideoResponse(prompt: string): Promise<string> {
    const models = [...new Set([
      this.primaryModel,
      this.fallbackModel,
    ])];

    let lastError: unknown;

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await this.client.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          if (!response.text?.trim()) {
            throw new Error(`Gemini returned an empty response (${model})`);
          }

          console.info(`Gemini generation succeeded with ${model}`);
          return response.text;
        } catch (error) {
          lastError = error;

          if (!isRetryable(error)) {
            throw error;
          }

          console.warn(
            `Gemini ${model} attempt ${attempt + 1} failed`,
            { status: getStatus(error) }
          );

          if (attempt < 1) {
            // Exponential backoff with jitter.
            await sleep(800 + Math.floor(Math.random() * 400));
          }
        }
      }
    }

    throw lastError;
  }
}