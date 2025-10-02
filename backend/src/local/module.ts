import { Module } from '@nestjs/common'
import { LocalService } from './service'
import { LocalController } from './controller'
import { PrismaModule } from '../prisma/module'

@Module({
  controllers: [LocalController],
  providers: [LocalService],
  imports: [PrismaModule],
})
export class LocalModule {}
