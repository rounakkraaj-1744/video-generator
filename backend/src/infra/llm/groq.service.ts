import dotenv from "dotenv"
dotenv.config()
import Groq from "groq-sdk"

export class GroqService {
    private readonly client: Groq;

    constructor(){
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey)
            throw new Error("Missing API Key")

        this.client = new Groq ({apiKey})
    }

    async generateCode (input: {
        topic: string,
        language: "java" | "typescript" | "javascript" | "c++",
        requirements: string
    }): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            temperature: 0.2,
            messages: [{
                role: "system",
                content: `
                    You are a senior software engineer and a technical educator. Generate technically correct and minimal code examples.
                    Return only the codes. No markdown fences or explanations needed.
                    The code must demonstrate the requested concept.
                    Do not invent APIs or emit essential implementation details.
                `.trim()
            },
            {
                role: "user",
                content: `Topic: ${input.topic}
                    Language: ${input.language}
                    Requirements: ${input.requirements}
                `.trim(),
            }
        ]})
        
        const code = response.choices[0]?.message?.content?.trim();

        if (!code) 
            throw new Error ("Code not returned by Groq")

        return code.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '').trim();
    }
}