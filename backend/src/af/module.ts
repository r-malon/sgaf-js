import { Module } from '@nestjs/common'
import { AfService } from './service'
import { AfController } from './controller'
import { PrismaModule } from '../prisma/module'

@Module({
  controllers: [AfController],
  providers: [AfService],
  imports: [PrismaModule],
})
export class AfModule {}
