import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { normalizedSearch } from './prisma/extensions/normalized-search'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super()
    this.$extends(normalizedSearch)
  }
  async onModuleInit() {
    await this.$connect()
  }
  async onModuleDestroy() {
    await this.$disconnect()
  }
}
