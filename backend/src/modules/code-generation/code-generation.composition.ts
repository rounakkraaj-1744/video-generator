import { GroqService } from "../../infra/llm/groq.service.js";
import { CodeGenerationService } from "./code-generation.service";

const groqService = new GroqService();

export const codeGenerationService = new CodeGenerationService( groqService );