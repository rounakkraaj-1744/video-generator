import { Router } from "express";
import { GeminiService } from "../../infra/llm/gemini.service";
import { GenerationController } from "./generation.controller";
import { GenerationService } from "./generation.service";

const router = Router();
const gemini = new GeminiService ();

const generationService = new GenerationService (gemini);
const generationController = new GenerationController (generationService);

router.post ("/generate", generationController.generate.bind (generationController))

export default router;