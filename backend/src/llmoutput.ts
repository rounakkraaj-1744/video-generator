import {GoogleGenAI} from "@google/genai"
import dotenv from "dotenv"
dotenv.config()

const googlegenai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function generateOutput (prompt: string){
    return googlegenai.interactions.create ({
        model: "gemini-3.8-flash",
        input: prompt
    })
}