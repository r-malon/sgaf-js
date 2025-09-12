import { Module } from '@nestjs/common'
import { AfModule } from './af/af.module'
import { ItemModule } from './item/item.module'
import { LocalModule } from './local/local.module'
import { ValorModule } from './valor/valor.module'
import { PrismaModule } from './prisma/prisma.module'
import { ContratoModule } from './contrato/contrato.module'

@Module({
  imports: [
    ContratoModule,
    AfModule,
    ItemModule,
    LocalModule,
    ValorModule,
    PrismaModule,
  ],
})
export class AppModule {}
