import { Module } from '@nestjs/common'
import { PrismaCrudModule } from 'nestjs-prisma-crud'
import { PrismaService } from './prisma.service'
import { AfModule } from './af/af.module'
import { ValorModule } from './valor/valor.module'
import { LocalModule } from './local/local.module'
import { ItemModule } from './item/item.module'

@Module({
  imports: [
    PrismaCrudModule.register({
      prismaService: PrismaService,
    }),
    AfModule,
    ValorModule,
    LocalModule,
    ItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
