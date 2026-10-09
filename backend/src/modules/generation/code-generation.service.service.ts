import { GroqService } from "../../infra/llm/groq.service";

export class CodeGenerationService {
    constructor(private readonly groq: GroqService){}

    async generateExampleCode (input: {
        topic: string,
        language: "java" | "typescript" | "javascript" | "c++",
        requirements: string
    }){
        const code = await this.groq.generateCode(input);

        return {
            language: input.language,
            code,
            lineCount: code.split("\n").length
        }
    }
}