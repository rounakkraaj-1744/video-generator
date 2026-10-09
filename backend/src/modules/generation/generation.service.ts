import { GeminiService } from "../../infra/llm/gemini.service";
import { videoProjectSchema } from "../../schemas/video-project.schema";
import { Constants } from "../../utils/contants";
import { type GenerateVideoRequest } from "./generation.types";

export class GenerationService {
    constructor (private readonly gemini:GeminiService){ }

    async generateVideo (data: GenerateVideoRequest){
        const prompt = new Constants().prompt.replace("<TOPIC>", data.prompt!).replace("<DURATION>", String(data.duration));

        const parsedResponse = JSON.parse(await this.gemini.generateVideoResponse(prompt) ?? "")

        return videoProjectSchema.parse(parsedResponse);
    }
}