import { Module } from '@nestjs/common'
import { ValorService } from './valor.service'
import { ValorController } from './valor.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  controllers: [ValorController],
  providers: [ValorService],
  imports: [PrismaModule],
})

export class ValorModule {}
