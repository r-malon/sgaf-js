import { Module } from '@nestjs/common';
import { ValorService } from './valor.service';
import { ValorController } from './valor.controller';

@Module({
  controllers: [ValorController],
  providers: [ValorService]
})
export class ValorModule {}
