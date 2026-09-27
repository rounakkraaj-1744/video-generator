import { Test, TestingModule } from '@nestjs/testing';
import { RenderingController } from './rendering.controller';
import { RenderingService } from './rendering.service';

describe('RenderingController', () => {
  let controller: RenderingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RenderingController],
      providers: [RenderingService],
    }).compile();

    controller = module.get<RenderingController>(RenderingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
