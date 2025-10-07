import { Module } from '@nestjs/common'
import { InstalacaoController } from './controller'
import { InstalacaoService } from './service'
import { PrismaModule } from '../prisma/module'

@Module({
  imports: [PrismaModule],
  controllers: [InstalacaoController],
  providers: [InstalacaoService],
})
export class InstalacaoModule {}
