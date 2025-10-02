import { Module } from '@nestjs/common'
import { ContratoService } from './service'
import { ContratoController } from './controller'
import { PrismaModule } from '../prisma/module'

@Module({
  controllers: [ContratoController],
  providers: [ContratoService],
  imports: [PrismaModule],
})
export class ContratoModule {}
