import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { normalizedSearch } from './extensions/normalized-search'
import { getTotal } from './extensions/get-total'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super()
    Object.assign(
      this,
      this.$extends(normalizedSearch).$extends(getTotal)
    )
  }
  async onModuleInit() {
    await this.$connect()
  }
  async onModuleDestroy() {
    await this.$disconnect()
  }
}
