import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { codeGenerationService } from "./code-generation.composition";
import type { CodeGenerationRequest } from "./code-generation.types";

function jsonResponse( statusCode: number, body: Record<string, unknown> ): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export async function handler( event: APIGatewayProxyEventV2 ): Promise<APIGatewayProxyStructuredResultV2> {
  let input: CodeGenerationRequest;

  try {
    const rawBody = event.body ? event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body : "";
    input = JSON.parse(rawBody);
  }
  catch {
    return jsonResponse(400, {
      success: false,
      message: "Invalid JSON request body",
    });
  }

  if (!input || typeof input.topic !== "string" || !input.topic.trim() || typeof input.requirements !== "string" || !input.requirements.trim() || !["java", "typescript", "javascript", "c++"].includes(input.language)) {
    return jsonResponse(400, {
      success: false,
      message: "Invalid topic, language, or requirements",
    });
  }

  try {
    const result = await codeGenerationService.generateExampleCode({
      topic: input.topic,
      language: input.language,
      requirements: input.requirements,
    });

    return jsonResponse(200, {
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Code generation failed:", error);

    return jsonResponse(500, {
      success: false,
      message: "Failed to generate example code",
    });
  }
}