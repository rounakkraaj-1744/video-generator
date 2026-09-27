import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { UpdateGenerationDto } from './dto/update-generation.dto';

@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post()
  generate (@Body() body: CreateGenerationDto){
    return this.generationService.generate(body);
  }
}
