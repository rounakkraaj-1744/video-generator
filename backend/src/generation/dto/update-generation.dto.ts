import { PartialType } from '@nestjs/mapped-types';
import { CreateGenerationDto } from './create-generation.dto';

export class UpdateGenerationDto extends PartialType(CreateGenerationDto) {}
