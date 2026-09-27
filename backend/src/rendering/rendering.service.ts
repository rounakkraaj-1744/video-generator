import { Injectable } from '@nestjs/common';
import { CreateRenderingDto } from './dto/create-rendering.dto';
import { UpdateRenderingDto } from './dto/update-rendering.dto';

@Injectable()
export class RenderingService {
  create(createRenderingDto: CreateRenderingDto) {
    return 'This action adds a new rendering';
  }

  findAll() {
    return `This action returns all rendering`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rendering`;
  }

  update(id: number, updateRenderingDto: UpdateRenderingDto) {
    return `This action updates a #${id} rendering`;
  }

  remove(id: number) {
    return `This action removes a #${id} rendering`;
  }
}
