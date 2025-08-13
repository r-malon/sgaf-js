import { Test, TestingModule } from '@nestjs/testing';
import { ValorController } from './valor.controller';
import { ValorService } from './valor.service';

describe('ValorController', () => {
  let controller: ValorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValorController],
      providers: [ValorService],
    }).compile();

    controller = module.get<ValorController>(ValorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
