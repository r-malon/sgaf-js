import { Test, TestingModule } from '@nestjs/testing';
import { ValorService } from './valor.service';

describe('ValorService', () => {
  let service: ValorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValorService],
    }).compile();

    service = module.get<ValorService>(ValorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
