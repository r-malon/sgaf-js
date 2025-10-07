import { Module } from '@nestjs/common'
import { AfModule } from './af/module'
import { ItemModule } from './item/module'
import { InstalacaoModule } from './instalacao/module'
import { LocalModule } from './local/module'
import { ValorModule } from './valor/module'
import { PrismaModule } from './prisma/module'
import { ContratoModule } from './contrato/module'

@Module({
  imports: [
    ContratoModule,
    AfModule,
    ItemModule,
    InstalacaoModule,
    LocalModule,
    ValorModule,
    PrismaModule,
  ],
})
export class AppModule {}
