import { Test, TestingModule } from '@nestjs/testing';
import { AfController } from './af.controller';
import { AfService } from './af.service';

describe('AfController', () => {
  let controller: AfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfController],
      providers: [AfService],
    }).compile();

    controller = module.get<AfController>(AfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
