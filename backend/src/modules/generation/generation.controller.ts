import { GenerationService } from "./generation.service";
import type { Request, Response } from "express";

export class GenerationController {
    constructor (private readonly generationService: GenerationService) {}

    async generate (req: Request, res: Response) {
        try {
            const result = await this.generationService.generateVideo(req.body);
            res.json ({
                success: true,
                project: result
            })
        } catch (error) {
            console.error (error)

            res.status(500).json({
                success: false,
                message: "Failed to generate video project"
            })
        }
    }
}