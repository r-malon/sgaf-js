import { Module } from '@nestjs/common'
import { ItemLocalController } from './controller'
import { ItemLocalService } from './service'
import { PrismaModule } from '../prisma/module'

@Module({
  imports: [PrismaModule],
  controllers: [ItemLocalController],
  providers: [ItemLocalService],
})
export class ItemLocalModule {}
