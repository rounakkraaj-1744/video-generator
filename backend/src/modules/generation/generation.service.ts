import { GeminiService } from "../../infra/llm/gemini.service";
import { videoProjectSchema } from "../../schemas/video-project.schema";
import { Constants } from "../../utils/contants";
import type { GenerateVideoRequest } from "./generation.types";

export class GenerationService {
  private readonly constants = new Constants();

  constructor(private readonly gemini: GeminiService) {}

  async generateVideo(data: GenerateVideoRequest) {
    if (!data.prompt?.trim())
      throw new Error("A prompt is required");

    if (typeof data.duration !== "number" || !Number.isFinite(data.duration) || data.duration <= 0)
      throw new Error("A valid duration is required");

    const prompt = this.constants.prompt.replace("<TOPIC>", data.prompt.trim()).replace("<DURATION>", String(data.duration));
    const response = await this.gemini.generateVideoResponse(prompt);

    if (!response?.trim()) 
      throw new Error("Gemini returned an empty response");

    const parsedResponse:unknown = JSON.parse(response);

    return videoProjectSchema.parse(parsedResponse);
  }
}