import { Module } from '@nestjs/common'
import { ValorService } from './service'
import { ValorController } from './controller'
import { PrismaModule } from '../prisma/module'

@Module({
  controllers: [ValorController],
  providers: [ValorService],
  imports: [PrismaModule],
})
export class ValorModule {}
