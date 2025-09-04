import { Module } from '@nestjs/common'
import { AfService } from './af.service'
import { AfController } from './af.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  controllers: [AfController],
  providers: [AfService],
  imports: [PrismaModule],
})
export class AfModule {}
