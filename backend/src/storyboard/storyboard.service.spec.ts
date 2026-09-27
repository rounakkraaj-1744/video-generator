import { Test, TestingModule } from '@nestjs/testing';
import { StoryboardService } from './storyboard.service';

describe('StoryboardService', () => {
  let service: StoryboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoryboardService],
    }).compile();

    service = module.get<StoryboardService>(StoryboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
