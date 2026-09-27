import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoryboardService } from './storyboard.service';
import { CreateStoryboardDto } from './dto/create-storyboard.dto';
import { UpdateStoryboardDto } from './dto/update-storyboard.dto';

@Controller('storyboard')
export class StoryboardController {
  constructor(private readonly storyboardService: StoryboardService) {}

  @Post()
  create(@Body() createStoryboardDto: CreateStoryboardDto) {
    return this.storyboardService.create(createStoryboardDto);
  }

  @Get()
  findAll() {
    return this.storyboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storyboardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryboardDto: UpdateStoryboardDto) {
    return this.storyboardService.update(+id, updateStoryboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyboardService.remove(+id);
  }
}
