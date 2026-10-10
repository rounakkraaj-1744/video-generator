import { GroqService } from "../../infra/llm/groq.service";
import { CodeGenerationService } from "./code-generation.service"
import { CodeValidatorService } from "./code-validator.service";

const groqService = new GroqService();
const validator = new CodeValidatorService();

export const codeGenerationService = new CodeGenerationService( groqService, validator );