import { Module } from '@nestjs/common';
import { AfService } from './af.service';
import { AfController } from './af.controller';

@Module({
  controllers: [AfController],
  providers: [AfService]
})
export class AfModule {}
