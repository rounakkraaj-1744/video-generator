import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
dotenv.config()

export class GeminiService {
    private readonly client: GoogleGenAI

    constructor() {
        this.client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })
    }

    async generateVideoResponse(prompt: string) {
        const response = await this.client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        return response.text;
    }
}