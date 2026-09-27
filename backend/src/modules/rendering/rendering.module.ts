import { Module } from '@nestjs/common';
import { RenderingService } from './rendering.service';
import { RenderingController } from './rendering.controller';

@Module({
  controllers: [RenderingController],
  providers: [RenderingService],
})
export class RenderingModule {}
