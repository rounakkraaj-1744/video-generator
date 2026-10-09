import dotenv from "dotenv"
dotenv.config()
import { codeGenerationService } from  "../src/modules/generation/code-generation.module";

async function main() {
  const result = await codeGenerationService.generateExampleCode({
    topic: 'Composition over inheritance',
    language: 'java',
    requirements: "Show a Car class that uses an Engine through composition. Include a minimal runnable example."
  });

  console.log(result.code);
}

main().catch(console.error);