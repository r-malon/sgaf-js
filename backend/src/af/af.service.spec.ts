import { Test, TestingModule } from '@nestjs/testing';
import { AfService } from './af.service';

describe('AfService', () => {
  let service: AfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AfService],
    }).compile();

    service = module.get<AfService>(AfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
