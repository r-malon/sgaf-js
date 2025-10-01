import { Module } from '@nestjs/common'
import { ItemLocalController } from './item-local.controller'
import { ItemLocalService } from './item-local.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ItemLocalController],
  providers: [ItemLocalService],
})
export class ItemLocalModule {}
