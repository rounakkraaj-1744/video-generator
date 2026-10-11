import type {APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2} from "aws-lambda"
import { GeminiService } from "../../infra/llm/gemini.service"
import { GenerationService } from "./generation.service"
import { type GenerateVideoRequest } from "./generation.types"
import { success } from "zod";

const gemini = new GeminiService();
const generationService = new GenerationService(gemini);

function jsonResponse (statusCode: number, body: Record<string, unknown>){
    return {
        statusCode,
        headers:{
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    }
}

export async function handler (event: APIGatewayProxyEventV2):Promise<APIGatewayProxyStructuredResultV2> {
    try {
        const body = event.body ? JSON.parse (event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body) : null;

        if (!body || typeof body.prompt !== "string" || !body.prompt.trim() || typeof body.duration !== "number" || !Number.isFinite(body.duration))
            return jsonResponse (400, {
                success:false,
                message: "A prompt and a valid duration are required"
            })

        const result = await generationService.generateVideo( body as GenerateVideoRequest );

        return jsonResponse (200, {
            success: true,
            project: result
        })
    }
    catch (error){
        if (error instanceof SyntaxError) 
            return jsonResponse (400, {
                success: false,
                message: "Invalid JSON body"
            })

        console.error("Failed to generate video project:", error);

        return jsonResponse(500, {
            success: false,
            message: "Failed to generate video project",
        });
    }
} 