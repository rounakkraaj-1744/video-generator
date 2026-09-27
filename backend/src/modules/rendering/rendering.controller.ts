import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RenderingService } from './rendering.service';
import { CreateRenderingDto } from './dto/create-rendering.dto';
import { UpdateRenderingDto } from './dto/update-rendering.dto';

@Controller('rendering')
export class RenderingController {
  constructor(private readonly renderingService: RenderingService) {}

  @Post()
  create(@Body() createRenderingDto: CreateRenderingDto) {
    return this.renderingService.create(createRenderingDto);
  }

  @Get()
  findAll() {
    return this.renderingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.renderingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRenderingDto: UpdateRenderingDto) {
    return this.renderingService.update(+id, updateRenderingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.renderingService.remove(+id);
  }
}
