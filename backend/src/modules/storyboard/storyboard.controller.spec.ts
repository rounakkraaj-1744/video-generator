import { Test, TestingModule } from '@nestjs/testing';
import { StoryboardController } from './storyboard.controller';
import { StoryboardService } from './storyboard.service';

describe('StoryboardController', () => {
  let controller: StoryboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryboardController],
      providers: [StoryboardService],
    }).compile();

    controller = module.get<StoryboardController>(StoryboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
