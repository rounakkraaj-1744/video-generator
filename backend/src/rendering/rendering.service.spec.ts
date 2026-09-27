import { Test, TestingModule } from '@nestjs/testing';
import { RenderingService } from './rendering.service';

describe('RenderingService', () => {
  let service: RenderingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RenderingService],
    }).compile();

    service = module.get<RenderingService>(RenderingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
