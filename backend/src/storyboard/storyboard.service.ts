import { Injectable } from '@nestjs/common';
import { CreateStoryboardDto } from './dto/create-storyboard.dto';
import { UpdateStoryboardDto } from './dto/update-storyboard.dto';

@Injectable()
export class StoryboardService {
  create(createStoryboardDto: CreateStoryboardDto) {
    return 'This action adds a new storyboard';
  }

  findAll() {
    return `This action returns all storyboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storyboard`;
  }

  update(id: number, updateStoryboardDto: UpdateStoryboardDto) {
    return `This action updates a #${id} storyboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} storyboard`;
  }
}
