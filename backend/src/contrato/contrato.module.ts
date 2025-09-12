import { Module } from '@nestjs/common'
import { ContratoService } from './contrato.service'
import { ContratoController } from './contrato.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  controllers: [ContratoController],
  providers: [ContratoService],
  imports: [PrismaModule],
})
export class ContratoModule {}
