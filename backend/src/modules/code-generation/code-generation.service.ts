import { GroqService } from "../../infra/llm/groq.service";
import type { CodeValidatorService } from "./code-validator.service";

export class CodeGenerationService {
    constructor(private readonly groq: GroqService, private readonly validator: CodeValidatorService){}

    async generateExampleCode (input: {
        topic: string,
        language: "java" | "typescript" | "javascript" | "c++",
        requirements: string
    }){
        const code = await this.groq.generateCode(input);

        let validation = {
            valid: true,
            errors: [] as string[]
        }

        if (input.language == "java"){
            validation = await this.validator.validateJava(code)
        }

        return {
            language: input.language,
            code,
            lineCount: code.split("\n").length,
            validation
        }
    }
}