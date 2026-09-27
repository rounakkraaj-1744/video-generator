import { PartialType } from '@nestjs/mapped-types';
import { CreateRenderingDto } from './create-rendering.dto';

export class UpdateRenderingDto extends PartialType(CreateRenderingDto) {}
