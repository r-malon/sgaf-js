import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { normalizedSearch } from './extensions/normalized-search'
import { getTotal } from './extensions/get-total'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: ReturnType<typeof createExtendedClient>

  constructor() {
    // create and type the extended client via helper
    this.client = createExtendedClient()
    // bind imperative helpers after client exists
    this.$transaction = this.client.$transaction.bind(this.client)
    this.$executeRaw = this.client.$executeRaw.bind(this.client)
    this.$queryRaw = this.client.$queryRaw.bind(this.client)
  }

  // forwarders for models (so existing code using this.prisma.xxx continues to work)
  get aF()    { return this.client.aF }
  get item()  { return this.client.item }
  get local() { return this.client.local }
  get valor() { return this.client.valor }

  // Placeholders — these get assigned in constructor to real bound functions
  $transaction!: typeof this.client.$transaction
  $executeRaw!: typeof this.client.$executeRaw
  $queryRaw!: typeof this.client.$queryRaw

  async onModuleInit() {
    await this.client.$connect()
  }
  async onModuleDestroy() {
    await this.client.$disconnect()
  }
}

// create the extended client in one place so typeof works if you need it elsewhere
function createExtendedClient() {
  const base = new PrismaClient()
  // apply extensions in the same order you want them applied at runtime
  return base.$extends(normalizedSearch).$extends(getTotal)
}
